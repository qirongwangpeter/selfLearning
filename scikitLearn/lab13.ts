// function asycPosMap<T>(arr:T[],f:T => Promise<number>):Promise<T[]>{
//     const promises = arr.map(e => f(e));
//     return Promise.all(promises).then(arr =>{

//     });
// }
function searchCities(query: string): Promise<string[]>{return Promise.resolve([""])};
function getCityElevation(cityName: string): Promise<number>{return Promise.resolve(0)};
type City = {name:string,elevation:number};


async function getHighCities(query:string):Promise<City[]>{
    const arr:City[] = [];
    return searchCities(query).then(async cities => {
        const promises = cities.map(getCityElevation);
        return Promise.all(promises).then(elevations => {
            elevations.forEach((e,i) => {
                const c:City = {name:cities[i],elevation:e};
                if(e > 5000){
                    arr.push(c);
                }
                
            });
        });
    }).then(_ =>arr);
}

async function getHighCities2(query:string):Promise<City[]>{
    const cities = await searchCities(query);
    const elevations = await Promise.all(cities.map(getCityElevation));
    return cities.map((e,i) => {
        return {name:e,elevation:elevations[i]}
    }).filter(e => e.elevation > 5000);
}