'use strict';

// public key and function to convert for push notifications
const publicVapidKey = 'BOSC85nEndB1sqxAl8Sxf5Ps-R7skrnVsSZm_GcN-4awm9KbEZXJsk7BluGIDAFCDRRLkhNReHEdHKl3HP11RKc';
const convertKey = (base64String) => {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

// document.getElementById("scanner").style.display = "none";

// document.querySelector('.scan').addEventListener('click', () => {
// 	scanner();
// })

if ('mediaDevices' in navigator) {
	console.log('camera is available on device');
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').then(function(reg) {
    console.log('Service Worker Registered!', reg);

    reg.pushManager.getSubscription().then(function(sub) {
      if (sub === null) {
        // Update UI to ask user to register for Push
        console.log('Not subscribed to push service!');
      } else {
        // We have a subscription, update the database
        console.log('Subscription object: ', sub);
        mockDataPush(sub);
      }
    });
  })
   .catch(function(err) {
    console.log('Service Worker registration failed: ', err);
  });
};

// async function register() {
// 	// register service worker
// 	if('serviceWorker' in navigator && 'PushManager' in window) {
// 		const register = await navigator.serviceWorker.register('../sw.js');
// 		console.log('service worker registered');
	
// 	// register push
// 		const subscription = register.pushManager.subscribe({
// 			userVisibleOnly: true,
// 			applicationServerKey: convertKey(publicVapidKey)
// 		});
// 		console.log('push registered');


// 		// send push notification
// 		await fetch('/subscribe', {
// 			method: 'POST',
// 			body: JSON.stringify(subscription),
// 			headers: {
// 				'content-type': 'application/json'
// 			}
// 		});
// 		console.log('push sent');
// 	} else {
// 		alert('notification and service is broken');
// 	}
// };

// // service worker
// async function registerSW() {
// 	if('serviceWorker' in navigator) {
// 		try {
// 			const register = await navigator.serviceWorker.register('../sw.js');
// 			console.log('registered service worker');
// 			registerPush(register);
// 		} catch (e) {
// 			alert('Service worker registration failed')
// 		}
// 	} else {
// 		console.log('sw is not going to work');
// 	}
// };

// // push register
// async function registerPush(sw) {
// 	if('PushManager' in window) {
// 		try {
// 			await sw.pushManager.subscribe({
// 				userVisibleOnly: true,
// 				applicationServerKey: convertKey(publicVapidKey)
// 			})
// 			console.log('push registered')
// 		} catch(e) {
// 			alert('push is not supported')
// 		}
// 	} else {
// 		console.log('push is not going to work on node');
// 	}

// sending from node
// 	await fetch('/subscribe', {
// 		method: 'POST',
// 		body: JSON.stringify(),
// 		headers: {
// 			'content-type': 'application/json'
// 		}
// 	});
// 	console.log('push sent from node')
// };

const addTask = () => {
	console.log('adding task')
	const list = document.querySelector('.list');
	const newTask = document.createElement('li');
	const button = document.createElement('button');
	const lineBreak = document.createElement('br');
	button.innerHTML = 'delete';
	newTask.appendChild(document.createTextNode('dummy data'));
	newTask.append(lineBreak);
	newTask.appendChild(button);
	button.setAttribute('class', 'btn btn-warning');
	list.appendChild(newTask);
}

// const makeAxiosCall = () => {
// 	axios.get({
// 		method: 'get',
// 		url: 'http://192.168.43.52:3000/tasks',
// 		headers: {
// 			"Access-Control-Allow-Origin": "*"
// 		}
// 	})
// 		.then(data => {
// 			console.log('returned data ',data.data)
// 		})
// 		.catch(err => {
// 			console.log('error getting data ', err)
// 		})
// };

// makeAxiosCall();

const makeFetchCall = () => {
	fetch('http://localhost:3000/tasks')
		.then(response => {
			return response.json();
		})
		.then(data => {
			console.log('this is the data', data);
		})
		.catch(err => {
			console.log('error in fetch call', err);
		})
}

// makeFetchCall();

// displaying notifications
const displayNotification = () => {
	console.log('displaying')
	if (Notification.permission == 'granted') {
		navigator.serviceWorker.getRegistration().then((reg) => {
			let options = {
				body: 'Here is the body of the message',
				icon: '/images/simple.png',
				data: {
					dateOfArrival: Date.now(),
					primaryKey: 1
				},
				actions: [
					{action: 'explore', title: 'Explore the world'},
					{action: 'close', title: 'close notification'}
				]
			};
			reg.showNotification('This is a notification', options);
		});
	}
};

Notification.requestPermission((status) => {
	console.log('Notification permission status: ', status);
});

const subscribeUser = () => {
	if ('PushManager' in window) {
		navigator.serviceWorker.ready.then(reg => {
		  	reg.pushManager.subscribe({
		  		userVisibleOnly: true,
		  		applicationServerKey: convertKey(publicVapidKey)
		  	}).then(sub => {
		  		console.log('Endpoint url: ', sub.endpoint);
		  		mockDataPush(sub);
		  	}).catch(e => {
		  		if (Notification.permission === 'denied') {
		  			console.log('permission was denied');
		  		} else {
		  			console.error('Unable to subscribe', e)
		  		}
		  	});
		  })
	}
}

async function mockDataPush(req) {
	await fetch('/subscribe', {
		method: 'POST',
		body: JSON.stringify(req),
		headers: {
			'content-type': 'application/json'
		}
	});
	console.log('request sent to node')
};

// const scanner = () => {
// 	console.log('scanner')
//     document.getElementById("scanner").style.display = "inline";
//   	const player = document.getElementById('player');
//   	const canvas = document.getElementById('canvas');
// 	const context = canvas.getContext('2d');
// 	const captureButton = document.getElementById('capture');

// 	  const constraints = {
// 	    video: true,
// 	  };

	  // captureButton.addEventListener('click', () => {
	  //   // Draw the video frame to the canvas.
	  //   console.log('this is camera data -> ', context);
	  //   context.drawImage(player, 0, 0, canvas.width, canvas.height);
	  //   player.srcObject.getVideoTracks().forEach(track => track.stop());
	  // });

	  // // Attach the video stream to the video element and autoplay.
	  // navigator.mediaDevices.getUserMedia(constraints)
	  //   .then((stream) => {
	  //     player.srcObject = stream;
	  //   });
// }

// const picture = document.getElementById('camera');

// picture.addEventListener('change', (e) => doSomething(e.target.files))

// const doSomething = (pic) => {
// 	console.log('this is the picture being sent ', pic);
// }

// function openQRCamera(node) {
//   var reader = new FileReader();
//   reader.onload = function() {
//     node.value = "";
//     qrcode.callback = function(res) {
//       if(res instanceof Error) {
//         alert("No QR code found. Please make sure the QR code is within the camera's frame and try again.");
//       } else {
//         node.parentNode.previousElementSibling.value = res;
//       }
//     };
//     qrcode.decode(reader.result);
//   };
//   reader.readAsDataURL(node.files[0]);
// }

// import QrScanner from "qr-scanner.min.js";
//     const video = document.getElementById('qr-video');
//     const camQrResult = document.getElementById('cam-qr-result');

//     function setResult(label, result) {
//         label.textContent = result;
//         label.style.color = 'teal';
//         clearTimeout(label.highlightTimeout);
//         label.highlightTimeout = setTimeout(() => label.style.color = 'inherit', 100);
//     }


//     // ####### Web Cam Scanning #######

//     const scanner = new QrScanner(video, result => setResult(camQrResult, result));
//     scanner.start();



