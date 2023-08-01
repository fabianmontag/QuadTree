# QuadTree
Typescript QuadTree Implementation

# Installtion
ou can find the TypeScript module file within the `./src` folder of the repository.

# Usage

### Import
```TS
import { QuadTree } from "./QuadTree";
```

### Create QuadTree instance
The constructor accepts two arguments: the first one defines the boundary of the QuadTree, expressed using the provided Rectangle class. The second argument is optional and sets the capacity of points in each quadrant before further sub-quadrant splitting occurs. The default capacity is set to 1.
```TS
const quadTree = new QuadTree(new Rectangle(0, 0, 400, 500), 1);
```

### Add Point
This function adds a point to the QuadTree instance, and the point is automatically placed in its corresponding quadrant. If the capacity of the quadrant is reached after adding the point, the quadrant is split into four sub-quadrants. The point should be of type `Vec2`.
```TS
quadTree.insertPoint({ x: 100, y: 100 });
```

## Querys
### getNearbyPointsInRectangle
The function takes two arguments: the center point of a square area and a radius, which represents half the size of the square's side length. It then selects all points within the square area defined by these parameters. The given point should be of type `Vec2`, and the radius of type `number`. The function returns an array of points in form of the `Vec2` interface.
```TS
const points = quadTree.getNearbyPointsInRectangle({ x: 50, y: 50 }, 50);
```

### getNearbyPointsInCircle
The function takes two arguments: the center point of a circle area and its radius. It then selects all points within the circle area defined by these parameters. The given point should be of type `Vec2`, and the radius of type `number`. The function returns an array of points in form of the `Vec2` interface.
```TS
const points = quadTree.getNearbyPointsInCircle({ x: 50, y: 50 }, 50);
```

## Rectangle
This class is used to represent 2D boundaries used by the QuadTree for calculations. The constructor accepts four arguments: the x and y coordinates of the top-left point, and the x and y coordinates of the bottom-right point.
```TS
const boundary = new Rectangle(0, 0, 400, 500)
```

## Vec2
This interface is used by the module to represent a point in 2D space.
```TS
interface Vec2 {
    x: number;
    y: number;
}
```
