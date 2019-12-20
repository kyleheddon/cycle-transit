export const RailLines = {
    Red: 'red',
    Gold: 'gold',
    Blue: 'blue',
    Green: 'green',
}

export const RailStations = [
    {
        name: "Airport",
        lines: [
            RailLines.Gold,
            RailLines.Red,
        ],
    },
    {
        name: "Arts Center",
        lines: [
            RailLines.Gold,
            RailLines.Red,
        ],
    },
    {
        name: "Ashby",
        lines: [
            RailLines.Green,
            RailLines.Blue,
        ],
    },
    {
        name: "Avondale",
        lines: [
            RailLines.Blue,
        ],
    },
    {
        name: "Bankhead",
        lines: [
            RailLines.Green,
        ],
    },
    {
        name: "Brookhaven / Oglethorpe",
        lines: [
            RailLines.Gold,
        ],
    },
    {
        name: "Buckhead",
        lines: [
            RailLines.Red,
        ],
    },
    {
        name: "Chamblee",
        lines: [
            RailLines.Gold,
        ],
    },
    {
        name: "Civic Center",
        lines: [
            RailLines.Gold,
            RailLines.Red,
        ],
    },
    {
        name: "College Park",
        lines: [
            RailLines.Gold,
            RailLines.Red,
        ],
    },
    {
        name: "Decatur",
        lines: [
            RailLines.Blue,
        ],
    },
    {
        name: "Dome / GWCC / Philips Arena / CNN Center",
        lines: [
            RailLines.Green,
            RailLines.Blue,
        ],
    },
    {
        name: "Doraville",
        lines: [
            RailLines.Gold,
        ],
    },
    {
        name: "Dunwoody",
        lines: [
            RailLines.Red,
        ],
    },
    {
        name: "East Lake",
        lines: [
            RailLines.Blue,
        ],
    },
    {
        name: "East Point",
        lines: [
            RailLines.Gold,
            RailLines.Red,
        ],
    },
    {
        name: "Edgewood / Candler Park",
        lines: [
            RailLines.Green,
            RailLines.Blue,
        ],
    },
    {
        name: "Five Points",
        lines: [
            RailLines.Gold,
            RailLines.Red,
            RailLines.Green,
            RailLines.Blue,
        ],
    },
    {
        name: "Garnett",
        lines: [
            RailLines.Gold,
            RailLines.Red,
        ],
    },
    {
        name: "Georgia State",
        lines: [
            RailLines.Green,
            RailLines.Blue,
        ],
    },
    {
        name: "Hamilton E. Holmes",
        lines: [
            RailLines.Gold,
            RailLines.Red,
        ],
    },
    {
        name: "Indian Creek",
        lines: [
            RailLines.Blue,
        ],
    },
    {
        name: "Inman Park / Reynoldstown",
        lines: [
            RailLines.Green,
            RailLines.Blue,
        ],
    },
    {
        name: "Kensington",
        lines: [
            RailLines.Blue,
        ],
    },
    {
        name: "King Memorial",
        lines: [
            RailLines.Green,
            RailLines.Blue,
        ],
    },
    {
        name: "Lakewood / Ft. McPherson",
        lines: [
            RailLines.Gold,
            RailLines.Red,
        ],
    },
    {
        name: "Lenox",
        lines: [
            RailLines.Gold,
        ],
    },
    {
        name: "Lindbergh Center",
        lines: [
            RailLines.Gold,
            RailLines.Red,
        ],
    },
    {
        name: "Medical Center",
        lines: [
            RailLines.Red,
        ],
    },
    {
        name: "Midtown",
        lines: [
            RailLines.Gold,
            RailLines.Red,
        ],
    },
    {
        name: "North Ave",
        lines: [
            RailLines.Gold,
            RailLines.Red,
        ],
    },
    {
        name: "North Springs",
        lines: [
            RailLines.Red,
        ],
    },
    {
        name: "Oakland City",
        lines: [
            RailLines.Gold,
            RailLines.Red,
        ],
    },
    {
        name: "Peachtree Center",
        lines: [
            RailLines.Gold,
            RailLines.Red,
        ],
    },
    {
        name: "Sandy Springs",
        lines: [
            RailLines.Red,
        ],
    },
    {
        name: "Vine City",
        lines: [
            RailLines.Green,
            RailLines.Blue,
        ],
    },
    {
        name: "West End",
        lines: [
            RailLines.Gold,
            RailLines.Red,
        ],
    },
    {
        name: "West Lake",
        lines: [
            RailLines.Blue,
        ],
    },
]

export const DirectionalLines = {
    NorthSouth: [
        RailLines.Red,
        RailLines.Gold,
    ],
    EastWest: [
        RailLines.Blue,
        RailLines.Green,
    ],
}

const GoogleToMarta = {
    'King Historic District': 'King Memorial',
}

export function fromGoogle(name) {
    if (GoogleToMarta[name]) {
        return GoogleToMarta[name];
    }

    return name
        .replace('-', ' / ')
        .replace(' Transit Station', '')
        .replace(' Station', '')
        .replace('Avenue', 'Ave');
}

export function areRailStationsOnSameDirectionalLine(stations) {
    const lineA = getDirectionalLineForStation(stations[0]);
    const lineB = getDirectionalLineForStation(stations[1]);
    return lineA === lineB && lineA !== null;
}

function getDirectionalLineForStation(stationName) {
    const station = getRailStation(stationName);
    if (!station) {
        return null;
    }
    return getDirectionalLineForRailLine(station.lines[0]);
}

function getDirectionalLineForRailLine(railLine) {
    for (let directionalLineKV of Object.entries(DirectionalLines)) {
        const [directionalLine, railLines] = directionalLineKV;
        if (railLines.includes(railLine)) {
            return directionalLine;
        }
    }
}

function getRailStation(stationName) {
    for (let station of RailStations) {
        if (station.name === stationName) {
            return station;
        }
    }
}

export function isRailStation(stationName) {
    for (let station of RailStations) {
        if (station.name === stationName) {
            return true;
        }
    }

    return false;
}

export function isStationOnLine(stationName, line) {
    for (let station of RailStations) {
        if (station.name === stationName) {
            return (station.lines.includes(line));
        }
    }

    return false;
}
