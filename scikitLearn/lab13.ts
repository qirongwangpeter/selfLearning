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
//------------------------------------------------------------------------------------------------
type Expression = { kind: "number", value: number }
| { kind: "operator", operator: "+" | "-", left: Expression, right: Expression }
function countSwaps(e: Expression): number {
    let count = 0;
    function v(e:Expression):number{
        if(e.kind === "number"){
            return e.value;
        }else{
            if(e.operator === "+"){
                return v(e.left)+v(e.right);
            }else{
                return v(e.left)-v(e.right);
            }
        }
    }
    if(e.kind === "operator"){
        switch(e.operator){
            case "+":
                count = 1 + countSwaps(e.left)+countSwaps(e.right);break;
            case "-":
                if(v(e.left) === v(e.right)){
                    count = 1 + countSwaps(e.left)+countSwaps(e.right);break;
                }else{
                    count = countSwaps(e.left)+countSwaps(e.right);break;
                }
        }
    }
    return count;
}
//-----------------------------------------------------------------------------------------------
//type c<T> = () => T | undefined;
function sequenceClosures<T>(c1:() => T | undefined,c2:() => T | undefined):() => T | undefined{
    let func = c1;
    return () => {
        let toReturn = func();
        if(toReturn === undefined && func === c1){
            func = c2;
            toReturn = func();
        }
        return toReturn;
    };
    
}
type Tree<T> = { val: T, left?: Tree<T>, right?: Tree<T> };
function treeCalls<T>(tree:Tree<T>):() => T|undefined {
    if(tree === undefined || tree.val === undefined){
        return () => undefined;
    }
    function treeCallsHelper<T>(tree:Tree<T>,arr:T[]){
        if(tree.val !== undefined){
            arr.push(tree.val);
        }
        if(tree.left){
            treeCallsHelper(tree.left,arr);
        }
        if(tree.right){
            treeCallsHelper(tree.right,arr);
        }
    }
    const arr:T[] = [];
    treeCallsHelper(tree,arr);
    let index = 0;
    return () => {
        if(index >= arr.length){
            return undefined
        }
        return arr[index++];
    };
}
//---------------------------------------------------------------------------------------

function p<T>(a:T[],f:(a:T)=>Promise<boolean>){
    return new Promise((res,rej) => {
        let [countT,countF] = [0,0];
        const full = Math.floor(a.length/2)+1;
        a.forEach(e => {
            f(e).then(b => {
                if(b){
                    countT++;
                    if(countT >= full){
                        res(true);
                    }
                }else{
                    countF++;
                    if(countF >= full){
                        res(false);
                    }
                }
                if(countT+countF === a.length){
                    rej("rejected");
                }
            })
        });
    })
}
//--------------------------------------------------------------------------------------------------------------------
interface MyIter<T> { hasNext: () => boolean; next: () => T }
class Iterable<T>{
    constructor(private arr:T[]){
    }
    makeIter():MyIter<T>{
        let index = 0;
        return {
            hasNext:() => {
                return index < this.arr.length;
            },
            next:() => {
                return this.arr[index++];
            }
        };
    }
}

type Point = { x: number, y: number };
function drawEll(ctr: Point, a: number, b: number){};
interface Shape { draw(): void };
class Ellipse implements Shape{
    constructor(protected center:Point,protected a:number,protected b:number){
    };
    draw(){
        drawEll(this.center,this.a,this.b);
    }
}
class Circle extends Ellipse{
    constructor(center:Point,radius:number){
        super(center,radius,radius);
    }
}
class CompoundShape extends Iterable<Shape> implements Shape{
    draw(){
        const it = this.makeIter();
        while(it.hasNext()){
            it.next().draw();
        }
    }
}
interface ScaleShape extends Shape {
    scaleX: (xf: number) => ScaleShape 
}
class ScaleEllipse extends Ellipse implements ScaleShape{
    scaleX(xf:number):ScaleEllipse{
        return new ScaleEllipse(this.center,this.a*xf,this.b);
    }
}
class ScaleCircle extends ScaleEllipse{
    scaleX(xf: number): ScaleEllipse {
        return new ScaleCircle(this.center,this.a*xf,this.b);
    }
}
class ScaleCompound implements ScaleShape{
    constructor(protected a:ScaleShape[]){}
    scaleX(xf: number):ScaleCo{

    }
}