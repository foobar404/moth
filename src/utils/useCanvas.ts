import React, { useRef } from 'react';


interface IProps {
    width?: number;
    height?: number;
}


export function useCanvas(props?: IProps) {
    let canvas = useRef<HTMLCanvasElement>(makeCanvas());
    let ctx = useRef<CanvasRenderingContext2D>(canvas.current.getContext('2d')!);

    canvas.current.style.imageRendering = "pixelated";
    canvas.current.style.willChange = "contents";
    ctx.current.imageSmoothingEnabled = false;

    function makeCanvas() {
        let canvas = document.createElement('canvas');
        canvas.width = props?.width ?? 8;
        canvas.height = props?.height ?? 8;

        return canvas;
    }

    function getHeight() {
        return canvas.current.height;
    }

    function getWidth() {
        return canvas.current.width;
    }

    function getSize(asArray = false) {
        if (asArray) return [canvas.current.width, canvas.current.height];
        else return { width: canvas.current.width, height: canvas.current.height };
    }

    function getElement() {
        return canvas.current;
    }

    function getCtx() {
        return ctx.current;
    }

    function clear(x = 0, y = 0, w = canvas.current.width, h = canvas.current.height) {
        ctx.current.clearRect(x, y, w, h);
    }

    function toDataURL() {
        return canvas.current.toDataURL("image/png");
    }

    function resize(width, height) {
        canvas.current.width = width;
        canvas.current.height = height;
        ctx.current.imageSmoothingEnabled = false;
    }

    function putImageData(imageData, x = 0, y = 0) {
        ctx.current.putImageData(imageData, x, y);
    }

    function drawImage(source, dx = 0, dy = 0, dWidth = canvas.current.width, dHeight = canvas.current.height) {
        ctx.current.drawImage(source, dx, dy, dWidth, dHeight);
    }

    function getImageData(x = 0, y = 0, width = canvas.current.width, height = canvas.current.height) {
        return ctx.current.getImageData(x, y, width, height);
    }

    function getColor(x = 0, y = 0) {
        return {
            r: ctx.current.getImageData(x, y, 1, 1).data[0],
            g: ctx.current.getImageData(x, y, 1, 1).data[1],
            b: ctx.current.getImageData(x, y, 1, 1).data[2],
            a: ctx.current.getImageData(x, y, 1, 1).data[3]
        };
    }

    function drawGrid(color1 = "#eee", color2 = "#ccc", size = 1) {
        let rows = Math.floor(canvas.current.height / size);
        let cols = Math.floor(canvas.current.width / size);

        ctx.current.fillStyle = color1;
        for (let y = 0; y < rows; y++) {
            for (let x = (y % 2); x < cols; x += 2) { // Adjust starting index based on row number
                ctx.current.fillRect(x * size, y * size, size, size);
            }
        }

        ctx.current.fillStyle = color2;
        for (let y = 0; y < rows; y++) {
            for (let x = (y % 2 === 0 ? 1 : 0); x < cols; x += 2) { // Adjust starting index based on row number
                ctx.current.fillRect(x * size, y * size, size, size);
            }
        }
    }

    function drawLine(start, end, size = 1, color?, prefect = false) {
        let points: { x: number, y: number }[] = [];
        let x0 = start.x;
        let y0 = start.y;
        let x1 = end.x;
        let y1 = end.y;

        let dx = Math.abs(x1 - x0);
        let dy = -Math.abs(y1 - y0);
        let sx = x0 < x1 ? 1 : -1;
        let sy = y0 < y1 ? 1 : -1;
        let err = dx + dy;

        while (true) {
            points.push({ x: x0, y: y0 });
            if (x0 === x1 && y0 === y1) break;
            let e2 = 2 * err;
            if (e2 >= dy) {
                err += dy; // Update the error term
                x0 += sx; // Move in the x direction
            }
            if (e2 <= dx) {
                err += dx; // Update the error term
                y0 += sy; // Move in the y direction
            }
        }

        points.forEach((point: { x: any, y: any }) => {
            drawPixel(point.x, point.y, size, color);
        });
    };

    function drawRect(x, y, width, height, color, fill = false) {
        if (fill) {
            // If fill is true, iterate over the rectangle area and draw pixels
            for (let i = 0; i <= width; i++) {
                for (let j = 0; j <= height; j++) {
                    drawPixel(x + i, y + j, 1, color); // Fill pixel inside the rectangle
                }
            }
        } else {
            // Draw the outline of the rectangle
            for (let i = 0; i <= width; i++) {
                drawPixel(x + i, y, 1, color); // Top
                drawPixel(x + i, y + height, 1, color); // Bottom
            }
            for (let i = 1; i < height; i++) { // Start from 1 and end before height to avoid double drawing the corners
                drawPixel(x, y + i, 1, color); // Left
                drawPixel(x + width, y + i, 1, color); // Right
            }
        }
    }

    function drawSquare(x, y, sideLength, color?, fill = false) {
        drawRect(x, y, sideLength, sideLength, color, fill);
    };

    function drawCircle(centerX, centerY, radius, color?, fill = false) {
        drawOval(centerX, centerY, radius, radius, color, fill);
    }

    function drawOval(centerX, centerY, radiusX, radiusY, color, fill = false) {
        if (fill) {
            for (let y = Math.ceil(centerY - radiusY); y <= Math.floor(centerY + radiusY); y++) {
                const preciseY = (y - centerY) / radiusY;
                const xSpan = radiusX * Math.sqrt(1 - preciseY * preciseY);

                // Contract the filling bounds slightly by rounding startX up and endX down.
                const startX = Math.ceil(centerX - xSpan + 0.5);
                const endX = Math.floor(centerX + xSpan - 0.5);

                for (let x = startX; x <= endX; x++) {
                    drawPixel(x, y, 1, color);
                }
            }
        } else {
            const step = 0.01; // Step for a smooth outline.
            for (let theta = 0; theta < 2 * Math.PI; theta += step) {
                const x = centerX + radiusX * Math.cos(theta);
                const y = centerY + radiusY * Math.sin(theta);
                drawPixel(Math.round(x), Math.round(y), 1, color);
            }
        }
    }

    function drawPolygon(points, close = false, color?) {
        for (let i = 1; i < points.length; i++) {
            drawLine(points[i - 1], points[i], 1, color);
        }
        if (close) drawLine(points[points.length - 1], points[0], 1, color);
    }

    function drawPixel(x, y, size = 1, color?) {
        if (color) {
            if (typeof color === 'string') ctx.current.fillStyle = color;
            else ctx.current.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a / 255})`;
        }

        ctx.current.fillRect(x, y, size, size);
    }

    function erasePixel(x, y, size = 1) {
        ctx.current.fillStyle = "rgba(0, 0, 0, .004)";
        ctx.current.fillRect(x, y, size, size);
    }

    function floodFill(
        startX,
        startY,
        callback: ((x: number, y: number) => void) | null = null,
        tolerance = 0
    ) {
        startX = Math.round(startX); // Ensure startX is a whole number
        startY = Math.round(startY); // Ensure startY is a whole number

        const startColor = getColorAtPixel(startX, startY);
        let pointsToCheck: { x: number, y: number }[] = [{ x: startX, y: startY }];
        let matchingPoints: { x: number, y: number }[] = [];
        let checkedPoints = new Set();

        while (pointsToCheck.length > 0) {
            let { x, y } = pointsToCheck.pop()!;
            if (!isValidPoint(x, y) || checkedPoints.has(`${x},${y}`) || !colorMatches(x, y, startColor, tolerance)) {
                continue;
            }

            matchingPoints.push({ x, y });
            checkedPoints.add(`${x},${y}`);

            if (callback) {
                callback(x, y);
            }

            // Add neighboring points to check
            pointsToCheck.push({ x: x + 1, y: y });
            pointsToCheck.push({ x: x - 1, y: y });
            pointsToCheck.push({ x: x, y: y + 1 });
            pointsToCheck.push({ x: x, y: y - 1 });
        }

        return matchingPoints;

        function isValidPoint(x, y) {
            // Assuming canvas and ctx are accessible in the current scope
            return x >= 0 && y >= 0 && x < canvas.current.width && y < canvas.current.height;
        }

        function colorMatches(x, y, targetColor, tolerance) {
            const pixelColor = getColorAtPixel(x, y);
            return pixelColor.every((value, index) => Math.abs(value - targetColor[index]) <= tolerance);
        }

        function getColorAtPixel(x, y) {
            // Assuming ctx is the context of your canvas and is accessible in the current scope
            const imageData = ctx.current.getImageData(x, y, 1, 1).data;
            return [imageData[0], imageData[1], imageData[2], imageData[3]]; // RGBA
        }
    }

    function getBoundary(points) {
        let minX = points[0].x;
        let maxX = points[0].x;
        let minY = points[0].y;
        let maxY = points[0].y;

        // Iterate through all points to find the min and max of x and y
        points.forEach(point => {
            minX = Math.min(minX, point.x);
            maxX = Math.max(maxX, point.x);
            minY = Math.min(minY, point.y);
            maxY = Math.max(maxY, point.y);
        });

        // Return the four corners of the bounding box
        return [
            { x: minX, y: minY }, // Top left
            { x: maxX, y: minY }, // Top right
            { x: maxX, y: maxY }, // Bottom right
            { x: minX, y: maxY }, // Bottom left
        ];
    }

    function getPointsInPolygon(points) {
        // Calculate the bounding box of the polygon
        let minX = points[0].x, maxX = points[0].x;
        let minY = points[0].y, maxY = points[0].y;
        points.forEach(point => {
            if (point.x < minX) minX = point.x;
            if (point.x > maxX) maxX = point.x;
            if (point.y < minY) minY = point.y;
            if (point.y > maxY) maxY = point.y;
        });

        // A simple point-in-polygon check using ray-casting algorithm
        function isPointInsidePolygon(point, polygon) {
            let intersects = 0;
            for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
                if (((polygon[i].y > point.y) != (polygon[j].y > point.y)) &&
                    (point.x < (polygon[j].x - polygon[i].x) * (point.y - polygon[i].y) / (polygon[j].y - polygon[i].y) + polygon[i].x)) {
                    intersects++;
                }
            }
            // If the number of intersections is odd, the point is inside the polygon
            return intersects % 2 !== 0;
        }

        // Generate points within the bounding box and check if they are inside the polygon
        let allPoints: { x: number, y: number }[] = [];
        for (let x = minX; x <= maxX; x++) {
            for (let y = minY; y <= maxY; y++) {
                let testPoint = { x: x, y: y };
                if (isPointInsidePolygon(testPoint, points)) {
                    allPoints.push(testPoint);
                }
            }
        }

        return allPoints;
    }

    return {
        getHeight,
        getWidth,
        getSize,
        getElement,
        getCtx,
        getColor,
        clear,
        resize,
        drawGrid,
        drawLine,
        drawCircle,
        drawSquare,
        drawRect,
        drawPolygon,
        drawPixel,
        erasePixel,
        drawOval,
        drawImage,
        toDataURL,
        getImageData,
        putImageData,
        floodFill,
        getBoundary,
        getPointsInPolygon,
    }
}