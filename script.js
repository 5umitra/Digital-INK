document.addEventListener('DOMContentLoaded', function () {
    var canvas = document.getElementById('signature-pad');
    var ctx = canvas.getContext('2d');
    var drawing = false;
    var strokes = [];
    var currentStroke = [];

    var colorPicker = document.getElementById('color');
    var thicknessControl = document.getElementById('thickness');
    var eraserThicknessControl = document.getElementById('eraser-thickness');
    var modeSwitch = document.getElementById('mode');

    var currentColor = colorPicker.value;
    var currentThickness = thicknessControl.value;
    var currentMode = modeSwitch.value;

    function saveStroke() {
        strokes.push([...currentStroke]);
        currentStroke = [];
    }

    function redrawCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        strokes.forEach(function (stroke) {
            ctx.beginPath();
            ctx.moveTo(stroke[0].x, stroke[0].y);
            ctx.lineWidth = stroke[0].thickness;
            ctx.strokeStyle = stroke[0].color;
            for (var i = 1; i < stroke.length; i++) {
                ctx.lineTo(stroke[i].x, stroke[i].y);
            }
            ctx.stroke();
        });
    }

    function getCanvasCoordinates(e) {
        var rect = canvas.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        var scaleX = canvas.width / rect.width;
        var scaleY = canvas.height / rect.height;
        return {
            x: x * scaleX,
            y: y * scaleY
        };
    }

    canvas.addEventListener('mousedown', function (e) {
        drawing = true;
        var pos = getCanvasCoordinates(e);
        currentStroke.push({
            x: pos.x,
            y: pos.y,
            color: currentMode === 'ink' ? currentColor : '#FFFFFF',
            thickness: currentMode === 'ink' ? currentThickness : eraserThicknessControl.value
        });
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
        ctx.strokeStyle = currentMode === 'ink' ? currentColor : '#FFFFFF';
        ctx.lineWidth = currentMode === 'ink' ? currentThickness : eraserThicknessControl.value;
    });

    canvas.addEventListener('mousemove', function (e) {
        if (drawing) {
            var pos = getCanvasCoordinates(e);
            var point = {
                x: pos.x,
                y: pos.y,
                color: currentMode === 'ink' ? currentColor : '#FFFFFF',
                thickness: currentMode === 'ink' ? currentThickness : eraserThicknessControl.value
            };
            currentStroke.push(point);
            ctx.lineTo(point.x, point.y);
            ctx.stroke();
        }
    });

    canvas.addEventListener('mouseup', function () {
        if (drawing) {
            drawing = false;
            saveStroke();
        }
    });

    document.getElementById('clear-button').addEventListener('click', function () {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        strokes = [];
        currentStroke = [];
    });

    document.getElementById('undo-button').addEventListener('click', function () {
        if (strokes.length > 0) {
            strokes.pop();
            redrawCanvas();
        }
    });

    document.getElementById('download-button').addEventListener('click', function () {
        var dataURL = canvas.toDataURL("image/png");
        var link = document.createElement('a');
        link.href = dataURL;
        link.download = 'signature.png';
        link.click();
    });

    colorPicker.addEventListener('change', function () {
        currentColor = this.value;
    });

    thicknessControl.addEventListener('input', function () {
        currentThickness = this.value;
    });

    eraserThicknessControl.addEventListener('input', function () {
        if (currentMode === 'eraser') {
            ctx.lineWidth = this.value;
        }
    });

    modeSwitch.addEventListener('change', function () {
        currentMode = this.value;
    });
});
