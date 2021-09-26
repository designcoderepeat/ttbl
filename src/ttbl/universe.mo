import Types "./types";

module {

    type Location = Types.Location;
    
    class Star(
        location: Location,
        size: Int;
    ) {

    };

    class Planet(
        location: Location,
        size: Int;
    ) {

    };

    class Object(
        location: Location,
        size: Int;
    ) {

    };

    public class Universe (
        dimensions: [Int], // minx, maxx, miny, maxy        
        stars: [Star],
        planets: [Planet],
        Object: [Objects]
    ) {
        
    };
}