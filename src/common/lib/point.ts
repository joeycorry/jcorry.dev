import type { Angle } from './angle';
import { Vector } from './vector';

class Point {
    public constructor(
        public readonly x: number,
        public readonly y: number,
    ) {}

    public calculateDistanceTo(other: Point): number {
        return Math.sqrt(
            Math.pow(this.x - other.x, 2) + Math.pow(this.y - other.y, 2),
        );
    }

    public calculateXDistanceTo(other: Point): number {
        return this.x - other.x;
    }

    public calculateYDistanceTo(other: Point): number {
        return this.y - other.y;
    }

    public toSubtracted(arg: Vector): Point;
    public toSubtracted(arg: { angle: Angle; length: number }): Point;
    public toSubtracted(arg: Vector | { angle: Angle; length: number }): Point {
        if (arg instanceof Vector) {
            return new Point(this.x - arg.x, this.y - arg.y);
        }

        const vector = arg.angle.toVector(arg.length);

        return this.toSubtracted(vector);
    }

    public toSummed(arg: Vector): Point;
    public toSummed(arg: { angle: Angle; length: number }): Point;
    public toSummed(arg: Vector | { angle: Angle; length: number }): Point {
        if (arg instanceof Vector) {
            return new Point(this.x + arg.x, this.y + arg.y);
        }

        const vector = arg.angle.toVector(arg.length);

        return this.toSummed(vector);
    }
}

export { Point };
