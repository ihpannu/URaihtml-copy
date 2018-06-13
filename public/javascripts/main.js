let initialized = false;
window.addEventListener("load", () => {
    button_callback();
});

// const startCamera = document.querySelector('#btn')
// startCamera.addEventListener('click', () => {
//     button_callback()
// })

let picoRunning = false,
    stillHere = false;
const personName = document.querySelector("#canidate-name")
// ledLight = document.querySelector("#btn");

function faceDetected() {
    if (picoRunning === true) return;
    picoRunning = true;
    restartPico();

    // console.log('Face Detected');
    axiosCall();
}

function restartPico() {
    setTimeout(() => {
        picoRunning = false;
    }, 1000);
    // console.log('Pico Restarted')
}

function takeSnapShot() {
    const canvas = document.querySelector("canvas");
    const ctx = canvas.getContext("2d");
    ctx.drawImage(canvas, 0, 0);
    let snap = canvas.toDataURL("image/png");
    // document.querySelector('#image').setAttribute('src', snap)
    return snap;
}

function dataURItoBlob(dataURI) {
    var binary = atob(dataURI.split(",")[1]);
    var array = [];
    for (var i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], {
        type: "image/jpeg"
    });
}

function axiosCall() {
    sendImage();
}

const axiosData = axiosCall;
const URL = "https://westus2.api.cognitive.microsoft.com/face/v1.0";
const API_KEY = "2d135cb4d63a4f069a05e19832a043c6";
const GROUP_ID = "fresh-team";
const URL_DETECT = "/detect?returnFaceId=true&returnFaceLandmarks=false";
let faceid;
let verifyData;
let candidateName;

// SEND IMAGE FOR RECOGNITION
function sendImage() {
    const snapShot = takeSnapShot();
    const blob = dataURItoBlob(snapShot);
    axios({
            method: "post",
            headers: {
                "content-type": "application/octet-stream",
                "Ocp-Apim-Subscription-Key": API_KEY
            },
            url: URL + URL_DETECT,
            data: blob
        })
        .then(response => {
            // console.log(response.data);
            faceid = response.data[0].faceId;
            // console.group('face id - ', faceid)
            // verifyDetails()
            const faceData = response.data;

            // console.table(faceData[0].faceRectangle)

            let rTop = faceData[0].faceRectangle.top,
                rLeft = faceData[0].faceRectangle.left,
                rWidth = faceData[0].faceRectangle.width,
                rHeight = faceData[0].faceRectangle.height;

            if (rWidth <= 100 && rHeight <= 100) {
                console.log("Face is not close enough");
                ifNoFaceFound();
                stillHere = false;
            } else if (rWidth >= 101 && rHeight >= 101) {
                // console.log('I will take photo once but will run continuously');
                if (stillHere === true) return;
                // console.log('Picture Taken');
                stillHere = true;
                verifyDetails();
            } else {
                ifNoFaceFound();
                stillHere = false;
                // console.log('Nothing in the frame');
            }
        })
        .catch(err => {
            redLight();
            ifError();
            console.error(err.message);
        });
}

// VERIFY DETAILS OF THE PERSON
function verifyDetails() {
    const verifyDetails = {
        personGroupId: GROUP_ID,
        faceIds: [faceid],
        maxNumOfCandidatesReturned: 1,
        confidenceThreshold: 0.65
    };
    axios({
            method: "post",
            headers: {
                "content-type": "application/json",
                "Ocp-Apim-Subscription-Key": API_KEY
            },
            url: URL + "/identify",
            data: JSON.stringify(verifyDetails)
        })
        .then(response => {
            verifyData = response.data;
            // console.table(verifyData)
            if (verifyData.length === 0) {
                // console.log('No person found with this face id');
                redLight();
                return;
            } else {
                // console.log("We found someone");

                getDetails();
                greenLight();
            }
        })
        .catch(err => {
            redLight();
            ifError();
            console.error(err.message);
        });
}

// GET DETAILS OF THE PERSON
function getDetails() {
    const CANDIDATE_DETAIL = verifyData[0].candidates[0].personId;
    const PERSON_DETAILS_URL =
        URL + "/persongroups/" + GROUP_ID + "/persons/" + CANDIDATE_DETAIL;
    axios({
            method: "get",
            headers: {
                "content-type": "application/json",
                "Ocp-Apim-Subscription-Key": API_KEY
            },
            url: PERSON_DETAILS_URL
        })
        .then(response => {
            // console.table(response.data)
            candidateName = response.data.name;
            console.log(candidateName);
            personName.innerHTML = candidateName;
        })
        .catch(err => {
            ifError();
            console.error(err.message);
        });
}

function ifNoFaceFound() {
    personName.innerHTML = "Face is not close enough";
}

function ifError() {
    stillHere = false;
    console.log("I catched error");
}

function greenLight() {
    console.log("request to turn on green led has been made");
    axios({
            method: "post",
            headers: {
                "content-type": "application/json"
            },
            url: "/led/green",
        })
        .then(response => {
            console.log("Success", response);
            // ledLight.classList.remove("is-danger");
            // ledLight.classList.add("is-success");
        })
        .catch(err => console.error("Error", err.message));
}

function redLight() {
    console.log("request to turn on red led has been made");
    axios({
            method: "post",
            headers: {
                "content-type": "application/json"
            },
            url: "/led/off"
        })
        .then(response => {
            console.log("Success", response);
            // ledLight.classList.remove("is-success");
            // ledLight.classList.add("is-danger");
        })
        .catch(err => console.log("Error", err.message));
}