import type { VectorStaticFromAngleAndLengthParameter } from './vector';
import { Vector } from './vector';

type PointAddAngleAndLengthParameter = VectorStaticFromAngleAndLengthParameter;

export class Point {
    public constructor(
        public x: number,
        public y: number,
    ) {}

    public addAngleAndLength(parameter: PointAddAngleAndLengthParameter) {
        return this.addVector(Vector.fromAngleAndLength(parameter));
    }

    public addVector(vector: Vector) {
        return new Point(this.x + vector.x, this.y + vector.y);
    }

    public calculateDistance(other: Point) {
        return Math.sqrt(
            Math.pow(this.x - other.x, 2) + Math.pow(this.y - other.y, 2),
        );
    }

    public calculateXDistance(other: Point) {
        return this.x - other.x;
    }

    public calculateYDistance(other: Point) {
        return this.y - other.y;
    }

    public toString() {
        return `(${this.x}, ${this.y})`;
    }
}
