// function asycPosMap<T>(arr:T[],f:T => Promise<number>):Promise<T[]>{
//     const promises = arr.map(e => f(e));
//     return Promise.all(promises).then(arr =>{

//     });
// }
function searchCities(query: string): Promise<string[]>{return Promise.resolve([""])};
function getCityElevation(cityName: string): Promise<number>{return Promise.resolve(0)};
type City = {name:string,elevation:number};


function getHighCities(query:string):Promise<City[]>{
    const arr:City[] = [];
    return searchCities(query).then(cities => {
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
function getHighCities3(query:string):Promise<City[]>{
    return searchCities(query).then(cities => {
        const promises = cities.map(getCityElevation);
        return Promise.all(promises).then(elevations => {
            return elevations.map((e,i) => ({name:cities[i],elevation:e})).filter(e => e.elevation>5000);
        });
    });
}
//-----------------------------------------------------------------------------------------------------------------
abstract class FastVector {
    constructor() {}
    rootSum(a: number[]): number[] { /* Some implementation */ }
    pairSum(a: number[], b: number[]): number[] { /* Some implementation */ }
    pairProduct(a: number[], b: number[]): number[] { /* Some implementation */ }
}

class SafeVector extends FastVector{
    constructor(){
        super();
    }
    private arrLenChecker(a:number[]){
        if(a.length <= 0){
            throw new Error("input should greater than 0");
        }
    }
    safeRootSum(a:number[]):number[]{
        this.arrLenChecker(a);
        if(a.reduce((acc,i)=>acc+i,0)< 0){
            throw new Error("sum of input arr must be non-negative");
        }
        return super.rootSum(a);
    }
    safePairSum(a:number[],b:number[]):number[]{
        this.arrLenChecker(a);
        this.arrLenChecker(b);
        return super.pairSum(a,b);
    }
    safePairProduct(a:number[],b:number[]):number[]{
        this.arrLenChecker(a);
        this.arrLenChecker(b);
        return super.pairProduct(a,b);
    }
}