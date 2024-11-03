window.addEventListener('scroll', function() {
    const navbar = document.querySelector('nav');
    const body = document.body;

    if (window.scrollY > 100) {  // When user scrolls down 100px from the top
        body.classList.add('scrolled');
    } else {
        body.classList.remove('scrolled');
    }
});

// Polyfill for requestAnimationFrame to ensure compatibility across browsers
window.requestAnimFrame = (function() {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function(callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

// Variables for canvas and fireworks
var canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d'),
    cw = window.innerWidth,
    ch = window.innerHeight,
    fireworks = [],
    particles = [],
    hue = 120,
    limiterTotal = 5,
    limiterTick = 0,
    timerTotal = 80,
    timerTick = 0,
    mousedown = false,
    mx,
    my;

// Set canvas dimensions
canvas.width = cw;
canvas.height = ch;

// Helper function to get random number in a range
function random(min, max) {
    return Math.random() * (max - min) + min;
}

// Helper function to calculate distance between two points
function calculateDistance(p1x, p1y, p2x, p2y) {
    var xDistance = p1x - p2x,
        yDistance = p1y - p2y;
    return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
}

// Firework constructor
function Firework(sx, sy, tx, ty) {
    this.x = sx;
    this.y = sy;
    this.sx = sx;
    this.sy = sy;
    this.tx = tx;
    this.ty = ty;
    this.distanceToTarget = calculateDistance(sx, sy, tx, ty);
    this.distanceTraveled = 0;
    this.coordinates = [];
    this.coordinateCount = 3;
    while (this.coordinateCount--) {
        this.coordinates.push([this.x, this.y]);
    }
    this.angle = Math.atan2(ty - sy, tx - sx);
    this.speed = 2;
    this.acceleration = 1.05;
    this.brightness = random(50, 70);
    this.targetRadius = 1;
}

// Update firework position
Firework.prototype.update = function(index) {
    this.coordinates.pop();
    this.coordinates.unshift([this.x, this.y]);

    if (this.targetRadius < 8) {
        this.targetRadius += 0.3;
    } else {
        this.targetRadius = 1;
    }

    this.speed *= this.acceleration;

    var vx = Math.cos(this.angle) * this.speed,
        vy = Math.sin(this.angle) * this.speed;

    this.distanceTraveled = calculateDistance(this.sx, this.sy, this.x + vx, this.y + vy);

    if (this.distanceTraveled >= this.distanceToTarget) {
        createParticles(this.tx, this.ty);
        fireworks.splice(index, 1);
    } else {
        this.x += vx;
        this.y += vy;
    }
}

// Draw firework trail
Firework.prototype.draw = function() {
    ctx.beginPath();
    ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
    ctx.lineTo(this.x, this.y);
    ctx.strokeStyle = 'hsl(' + hue + ', 100%, ' + this.brightness + '%)';
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(this.tx, this.ty, this.targetRadius, 0, Math.PI * 2);
    ctx.stroke();
}

// Particle constructor for firework explosion
function Particle(x, y) {
    this.x = x;
    this.y = y;
    this.coordinates = [];
    this.coordinateCount = 5;
    while (this.coordinateCount--) {
        this.coordinates.push([this.x, this.y]);
    }
    this.angle = random(0, Math.PI * 2);
    this.speed = random(1, 10);
    this.friction = 0.95;
    this.gravity = 1;
    this.hue = random(hue - 20, hue + 20);
    this.brightness = random(50, 80);
    this.alpha = 1;
    this.decay = random(0.015, 0.03);
}

// Update particle position
Particle.prototype.update = function(index) {
    this.coordinates.pop();
    this.coordinates.unshift([this.x, this.y]);

    this.speed *= this.friction;
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed + this.gravity;
    this.alpha -= this.decay;

    if (this.alpha <= this.decay) {
        particles.splice(index, 1);
    }
}

// Draw particle trail
Particle.prototype.draw = function() {
    ctx.beginPath();
    ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
    ctx.lineTo(this.x, this.y);
    ctx.strokeStyle = 'hsla(' + this.hue + ', 100%, ' + this.brightness + '%, ' + this.alpha + ')';
    ctx.stroke();
}

// Create particle explosion
function createParticles(x, y) {
    var particleCount = 30;
    while (particleCount--) {
        particles.push(new Particle(x, y));
    }
}

// Main animation loop
function loop() {
    requestAnimFrame(loop);
    hue += 0.5;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, cw, ch);

    ctx.globalCompositeOperation = 'lighter';

    var i = fireworks.length;
    while (i--) {
        fireworks[i].draw();
        fireworks[i].update(i);
    }

    var j = particles.length;
    while (j--) {
        particles[j].draw();
        particles[j].update(j);
    }

    if (timerTick >= timerTotal) {
        if (!mousedown) {
            fireworks.push(new Firework(cw / 2, ch, random(0, cw), random(0, ch / 2)));
            timerTick = 0;
        }
    } else {
        timerTick++;
    }
}

// Start the animation loop
loop();

// Mouse down event to trigger fireworks
window.addEventListener('mousedown', function(e) {
    mousedown = true;
    mx = e.clientX;
    my = e.clientY;
    fireworks.push(new Firework(cw / 2, ch, mx, my));
});

// Mouse up event
window.addEventListener('mouseup', function() {
    mousedown = false;
});

const treePrice = 10; // Cost of one tree

// Function to calculate total price
function calculateTotal() {
    const numTrees = document.getElementById('numTrees').value || 0;
    const total = numTrees * treePrice;
    document.getElementById('totalPrice').textContent = 'Total Price: $' + total;
}

// PayPal buttons configuration
paypal.Buttons({
    createOrder: function(data, actions) {
        const numTrees = document.getElementById('numTrees').value || 1;
        const total = numTrees * treePrice;
        return actions.order.create({
            purchase_units: [{
                amount: {
                    value: total.toFixed(2) // Set donation amount here based on the total price
                }
            }]
        });
    },
    onApprove: function(data, actions) {
        return actions.order.capture().then(function(details) {
            alert('Thank you, ' + details.payer.name.given_name + '! Your donation has been received.');
            window.location.href = "success.html"; // Redirect to success page after successful payment
        });
    }
}).render('#paypal-button-container');

// Validate form
function validateForm(event) {
    event.preventDefault();
    var cardholderName = document.getElementById('cardholderName').value;
    var cardNumber = document.getElementById('cardNumber').value;
    var expiryDate = document.getElementById('expiryDate').value;
    var cvv = document.getElementById('cvv').value;
    var email = document.getElementById('emailInput').value;

    if (!cardholderName || !cardNumber || !expiryDate || !cvv || !email) {
        alert('Please fill out all fields.');
        return false;
    }

    // Perform payment processing here, then trigger PayPal
    paypal.Buttons().render('#paypal-button-container');
}

// Retrieve 'trees' parameter from the URL and pre-fill the number of trees field
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Get the 'trees' parameter from the URL
const numberOfTrees = getQueryParam('trees');

// If the 'trees' parameter exists, pre-fill the number of trees field
if (numberOfTrees) {
    document.getElementById('numTrees').value = numberOfTrees;
    calculateTotal(); // Update total price based on the number of trees
}

window.addEventListener('scroll', function() {
    const navbar = document.querySelector('nav');
    const body = document.body;

    if (window.scrollY > 100) {  // When user scrolls down 100px from the top
        body.classList.add('scrolled');
    } else {
        body.classList.remove('scrolled');
    }
});

let currentSlide = 1;

function showSlide(n) {
    let slides = document.querySelectorAll('.slideshow img');

    // Wrap around slide numbers
    if (n > slides.length) {
        currentSlide = 1;
    } else if (n < 1) {
        currentSlide = slides.length;
    }

    // Hide all slides (set opacity to 0)
    slides.forEach(slide => {
        slide.classList.remove('active-slide'); // Remove the active class from all
    });

    // Show the current slide (set opacity to 1)
    slides[currentSlide - 1].classList.add('active-slide');
}

// Automatically change slides every 3 seconds
setInterval(() => {
    currentSlide++;
    showSlide(currentSlide);
}, 3000);

// Show the first slide on page load
showSlide(currentSlide);


// Initialize the total trees planted
let totalTreesPlanted = 0;
const totalTreeGoal = 1000; // Define your overall goal (e.g., 1000 trees)

function updateOverallProgress() {
    const overallProgressBar = document.getElementById("overall-progress-bar");
    const overallProgressText = document.getElementById("overall-progress-text");

    // Update the progress bar value
    overallProgressBar.value = totalTreesPlanted;
    overallProgressBar.max = totalTreeGoal;

    // Update the text to show the number of trees planted
    overallProgressText.textContent = `${totalTreesPlanted}/${totalTreeGoal} trees planted`;
}

function addTreeMarker(location, address) {
    // Existing marker creation code...

    // Increment the overall number of trees planted
    totalTreesPlanted++;

    // Update the overall progress bar
    updateOverallProgress();
}

// Load totalTreesPlanted from local storage on page load
window.onload = () => {
    totalTreesPlanted = localStorage.getItem("totalTreesPlanted") || 0;
    updateOverallProgress();
};

// Save totalTreesPlanted to local storage when a tree is planted
function addTreeMarker(location, address) {
    // Existing marker creation code...

    totalTreesPlanted++;
    localStorage.setItem("totalTreesPlanted", totalTreesPlanted); // Save to local storage

    updateOverallProgress();
}

let map;
let autocomplete;
let markers = []; // Array to store tree markers and addresses

// Function to load the Google Maps JavaScript API asynchronously
function loadGoogleMapsAPI() {
    const script = document.createElement('script');
    script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDAdOFcGdrhJ-kkaPEcIwinbDE2c2vO-9o&libraries=places,marker&v=beta';
    script.async = true;
    script.defer = true; // Ensure the script executes after the document is parsed

    // When the script loads, initialize the map
    script.onload = initMap;

    document.head.appendChild(script);
}

function initMap() {
    const initialLatLng = { lat: -33.9, lng: 151.2 };
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 10,
        center: initialLatLng,
        mapId: "b047284208cd25e3", // Set your Map ID here
    });

    // Initialize the autocomplete functionality
    initAutocomplete();

    // Add a click listener to add tree markers
    map.addListener("click", (event) => {
        geocodeLatLng(event.latLng);
    });
}

function initAutocomplete() {
    const addressField = document.querySelector("#ship-address");

    // Create the autocomplete object
    autocomplete = new google.maps.places.Autocomplete(addressField, {
        componentRestrictions: { country: ["us", "ca"] },
        fields: ["address_components", "geometry"],
        types: ["address"],
    });

    // When the user selects an address from the drop-down, populate the address fields
    autocomplete.addListener("place_changed", fillInAddress);
}

function fillInAddress() {
    const place = autocomplete.getPlace();
    if (!place.geometry) {
        alert("No details available for the selected address.");
        return;
    }

    const location = place.geometry.location;

    // Add a tree marker at the selected address using AdvancedMarkerElement
    geocodeLatLng(location); // Check if the location is suitable before adding the marker

    map.setCenter(location);
    map.setZoom(15);
}

function geocodeLatLng(latLng) {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: latLng }, (results, status) => {
        if (status === "OK" && results[0]) {
            const address = results[0].formatted_address;
            const locationTypes = results[0].types; // Get all location types (e.g., "locality", "park")

            if (isGreenArea(locationTypes)) {
                addTreeMarker(latLng, address);  // Add marker only if in a green zone
            } else {
                alert("Tree planting is restricted in this area. Please plant trees in designated green zones like parks.");
            }
        } else {
            console.error("Geocode was not successful: " + status);
        }
    });
}

function isGreenArea(locationTypes) {
    // Define allowed location types where planting trees is encouraged
    const allowedTypes = ["park", "natural_feature"];

    // Check if any of the location types match allowed types
    return locationTypes.some(type => allowedTypes.includes(type));
}

function addTreeMarker(location, address) {
    const markerElement = document.createElement("div");
    markerElement.innerHTML = `<img src="https://img.icons8.com/color/48/deciduous-tree.png" alt="Tree Icon" style="width: 50px; height: 50px;">`;

    const marker = new google.maps.marker.AdvancedMarkerElement({
        position: location,
        map: map,
        title: "Tree",
        content: markerElement,
    });

    markers.push({ marker, address });
    updateAddressList();
}

function updateAddressList() {
    const addressList = document.getElementById('address-list');
    const donateButton = document.getElementById('donate-trees-button');
    addressList.innerHTML = '';

    markers.forEach(({ marker, address }, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = address;

        const viewButton = document.createElement('button');
        viewButton.textContent = 'View';
        viewButton.classList.add('view-btn');

        viewButton.addEventListener('click', () => {
            const lat = marker.position.lat();
            const lng = marker.position.lng();
            window.location.href = `index.html?lat=${lat}&lng=${lng}`;
        });

        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.classList.add('remove-btn');

        removeButton.addEventListener('click', () => {
            marker.map = null;
            markers.splice(index, 1);
            updateAddressList();
        });

        listItem.appendChild(viewButton);
        listItem.appendChild(removeButton);
        addressList.appendChild(listItem);
    });

    // Set URL parameter to include number of trees
    const treeCount = markers.length;
    donateButton.href = `pay.html?trees=${treeCount}`;
    donateButton.style.display = treeCount > 0 ? 'block' : 'none';
}

// Load Google Maps API after the document is fully loaded
window.onload = loadGoogleMapsAPI;

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////


document.getElementById('donate-trees-button').addEventListener('click', function() {
    const addressList = document.querySelectorAll('#address-list li');
    addressList.forEach(address => {
        const addressText = address.innerText;

        fetch('/submitOrder', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                address: addressText,
                num_trees: 1 // Or get the actual number of trees if needed
            }),
        })
            .then(response => response.json())
            .then(data => console.log('Order submitted with ID:', data.order_id))
            .catch(error => console.error('Error:', error));
    });
});

document.getElementById('paymentForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const cardholderName = document.getElementById('cardholderName').value;
    const cardNumber = document.getElementById('cardNumber').value;
    const expiryDate = document.getElementById('expiryDate').value;
    const cvv = document.getElementById('cvv').value;
    const email = document.getElementById('emailInput').value;
    const totalPrice = document.getElementById('totalPrice').innerText.replace('Total Price: $', '');
    const orderId = 1;  // Get the actual order ID from your logic

    fetch('/submitPayment', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            cardholder_name: cardholderName,
            card_number: cardNumber,
            expiry_date: expiryDate,
            cvv: cvv,
            email: email,
            total_price: totalPrice,
            order_id: orderId
        }),
    })
        .then(response => response.json())
        .then(data => console.log('Payment submitted with ID:', data.payment_id))
        .catch(error => console.error('Error:', error));
});
