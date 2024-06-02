// assets/js/GenQRCode.js

// Load the QRCode.js library dynamically
function loadScript(url, callback) {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = url;

    script.onreadystatechange = callback;
    script.onload = callback;

    document.head.appendChild(script);
}

// Function to generate QR Code
function GenQRCode(url) {
    var qrcodeContainer = document.getElementById("qrcode");
    qrcodeContainer.innerHTML = ""; // Clear any previous QR code

    if (typeof QRCode === "undefined") {
        loadScript("https://cdn.jsdelivr.net/npm/qrcodejs@1.0.0/qrcode.min.js", function() {
            generateQRCode(url);
        });
    } else {
        generateQRCode(url);
    }
}

// Generate the QR code using QRCode.js with a white boundary
function generateQRCode(url) {
    var qrSize = 300;
    var boundarySize = 5;
    var totalSize = qrSize + 2 * boundarySize;

    // Create a temporary container for the QR code
    var tempContainer = document.createElement('div');
    var qrcode = new QRCode(tempContainer, {
        text: url,
        width: qrSize,
        height: qrSize,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
    });

    // Wait for the QR code to be generated
    setTimeout(function() {
        var qrCanvas = tempContainer.querySelector('canvas');
        var canvas = document.createElement('canvas');
        canvas.width = totalSize;
        canvas.height = totalSize;
        var ctx = canvas.getContext('2d');

        // Fill the background with white
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, totalSize, totalSize);

        // Draw the QR code on the larger canvas with a boundary
        ctx.drawImage(qrCanvas, boundarySize, boundarySize, qrSize, qrSize);

        // Append the new canvas to the qrcode container
        var qrcodeContainer = document.getElementById("qrcode");
        qrcodeContainer.innerHTML = ""; // Clear any previous QR code
        qrcodeContainer.appendChild(canvas);
    }, 100);
}

// Download the generated QR code in specified format
function downloadQRCode(format) {
    var canvas = document.querySelector('#qrcode canvas');
    if (canvas) {
        var dataURL = canvas.toDataURL(format);
        var link = document.createElement('a');
        link.href = dataURL;
        link.download = 'qrcode.' + format.split('/')[1];
        link.click();
    }
}

// Event listener for the generate button
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('generateBtn').addEventListener('click', function() {
        var url = document.getElementById('urlInput').value;
        if (url) {
            GenQRCode(url);
            document.getElementById('downloadWebpBtn').style.display = 'inline';
            document.getElementById('downloadPngBtn').style.display = 'inline';
        }
    });

    document.getElementById('downloadWebpBtn').addEventListener('click', function() {
        downloadQRCode('image/webp');
    });

    document.getElementById('downloadPngBtn').addEventListener('click', function() {
        downloadQRCode('image/png');
    });
});
