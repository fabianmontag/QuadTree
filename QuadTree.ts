interface Vec2 {
    x: number;
    y: number;
}

const createVec2 = (x?: number, y?: number): Vec2 => {
    return {
        x: x ?? 0,
        y: y ?? 0,
    };
};

const rectanglesIntersect = (minAx: number, minAy: number, maxAx: number, maxAy: number, minBx: number, minBy: number, maxBx: number, maxBy: number) => {
    let aLeftOfB = maxAx < minBx;
    let aRightOfB = minAx > maxBx;
    let aAboveB = minAy > maxBy;
    let aBelowB = maxAy < minBy;

    return !(aLeftOfB || aRightOfB || aAboveB || aBelowB);
};

const rectangleIntersectsCircle = (rect: Rectangle, cx: number, cy: number, cr: number) => {
    const { x1, y1, x2, y2 } = rect;
    const middlePoint = createVec2(x1 + (x2 - x1) / 2, y1 + (y2 - y1) / 2);
    const width = x2 - x1;
    const height = y2 - y1;

    const distX = Math.abs(cx - middlePoint.x);
    const distY = Math.abs(cy - middlePoint.y);

    if (distX > width / 2 + cr) return false;
    else if (distY > height / 2 + cr) return false;
    else if (distX <= width / 2) return true;
    else if (distY <= height / 2) return true;

    const dx = distX - width / 2;
    const dy = distY - height / 2;
    return dx * dx + dy * dy <= cr * cr;
};

export class Rectangle {
    public x1: number;
    public y1: number;
    public x2: number;
    public y2: number;

    constructor(x1: number, y1: number, x2: number, y2: number) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }

    containsPoint(p: Vec2) {
        if (p.x >= this.x1 && p.x <= this.x2 && p.y >= this.y1 && p.y <= this.y2) {
            return true;
        } else return false;
    }

    intersectsWithRect(other: Rectangle) {
        return rectanglesIntersect(this.x1, this.y1, this.x2, this.y2, other.x1, other.y1, other.x2, other.y2);
    }

    intersectsWithCircle(cx: number, cy: number, cr: number) {
        return rectangleIntersectsCircle(this, cx, cy, cr);
    }
}

const pointInCircle = (circle_x: number, circle_y: number, rad: number, x: number, y: number) => {
    if ((x - circle_x) * (x - circle_x) + (y - circle_y) * (y - circle_y) <= rad * rad) return true;
    else return false;
};

export class QuadTree {
    boundary: Rectangle;

    split: boolean;
    topLeftQuad: QuadTree | undefined;
    topRightQuad: QuadTree | undefined;
    bottomLeftQuad: QuadTree | undefined;
    bottomRightQuad: QuadTree | undefined;
    points: Vec2[];
    capacity: number;

    constructor(boundary: Rectangle) {
        this.boundary = boundary;
        this.split = false;
        this.points = [];
        this.capacity = 1;
    }

    splitIntoQuads() {
        const { x1, y1, x2, y2 } = this.boundary;
        const middlePoint = createVec2(x1 + (x2 - x1) / 2, y1 + (y2 - y1) / 2);

        const topLeftQuad = new QuadTree(new Rectangle(x1, y1, middlePoint.x, middlePoint.y));
        this.topLeftQuad = topLeftQuad;

        const topRightQuad = new QuadTree(new Rectangle(middlePoint.x, y1, x2, middlePoint.y));
        this.topRightQuad = topRightQuad;

        const bottomLeftQuad = new QuadTree(new Rectangle(x1, middlePoint.y, middlePoint.x, y2));
        this.bottomLeftQuad = bottomLeftQuad;

        const bottomRightQuad = new QuadTree(new Rectangle(middlePoint.x, middlePoint.y, x2, y2));
        this.bottomRightQuad = bottomRightQuad;

        this.split = true;
    }

    insertPoint(point: Vec2) {
        if (!this.boundary.containsPoint(point)) return;

        if (this.points.length < this.capacity) {
            this.points.push(point);
        } else {
            if (!this.split) this.splitIntoQuads();

            if (this.topLeftQuad?.boundary.containsPoint(point)) {
                this.topLeftQuad.insertPoint(point);
            } else if (this.topRightQuad?.boundary.containsPoint(point)) {
                this.topRightQuad.insertPoint(point);
            } else if (this.bottomLeftQuad?.boundary.containsPoint(point)) {
                this.bottomLeftQuad.insertPoint(point);
            } else if (this.bottomRightQuad?.boundary.containsPoint(point)) {
                this.bottomRightQuad.insertPoint(point);
            }
        }
    }

    getNearbyPointsInRectangle(b: Vec2, radius: number): Vec2[] {
        const radiusRectangle = new Rectangle(b.x - radius, b.y - radius, b.x + radius, b.y + radius);

        const points: Vec2[] = [];

        if (this.boundary.intersectsWithRect(radiusRectangle)) {
            for (const point of this.points) {
                if (radiusRectangle.containsPoint(point)) points.push(point);
            }

            if (this.split) {
                points.push(...this.topLeftQuad!.getNearbyPointsInRectangle(b, radius));
                points.push(...this.topRightQuad!.getNearbyPointsInRectangle(b, radius));
                points.push(...this.bottomLeftQuad!.getNearbyPointsInRectangle(b, radius));
                points.push(...this.bottomRightQuad!.getNearbyPointsInRectangle(b, radius));
            }
        }

        return points;
    }

    getNearbyPointsInCircle(b: Vec2, radius: number): Vec2[] {
        const points: Vec2[] = [];

        if (this.boundary.intersectsWithCircle(b.x, b.y, radius)) {
            for (const point of this.points) {
                if (pointInCircle(b.x, b.y, radius, point.x, point.y)) points.push(point);
            }

            if (this.split) {
                points.push(...this.topLeftQuad!.getNearbyPointsInCircle(b, radius));
                points.push(...this.topRightQuad!.getNearbyPointsInCircle(b, radius));
                points.push(...this.bottomLeftQuad!.getNearbyPointsInCircle(b, radius));
                points.push(...this.bottomRightQuad!.getNearbyPointsInCircle(b, radius));
            }
        }

        return points;
    }
}
