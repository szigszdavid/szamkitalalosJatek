import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'
//import { integretyCheck } from 'yjs/dist/src/internals'

const input = document.querySelector('#tipp')
const gomb = document.querySelector("#tippGomb")
const ul = document.querySelector("#tippek")
const reset = document.querySelector("#resetGomb")
const newGame = document.querySelector("#newGameGomb")

const doc = new Y.Doc()
const wsProvider = new WebsocketProvider('ws://localhost:1234', 'david', doc)

wsProvider.on('status', event => {
  console.log(event.status) // logs "connected" or "disconnected"
})

const szamkitalalosMap = doc.getMap("my-first-map")
// Régi megoldás
const tippekArray = new Y.Array()//doc.getArray("tippek-array")

function veletlen(a,b) {
  return Math.floor(Math.random() * (b - a + 1)) + a
}

/*
let kitalalandoSzam = veletlen(1, 100)
console.log("KitalalandoSzam : " + kitalalandoSzam);
let vege = false

//init
input.disabled = vege
input.disabled = vege
szamkitalalosMap.set("inputIsDisabled",[false])
gomb.disabled = vege
szamkitalalosMap.set("gombIsDisabled",[false])
szamkitalalosMap.set("kitalalandoSzam",[kitalalandoSzam])
*/
let vege = false
let kitalalandoSzam    


tippekArray.observe(yarrayEvent => {
  yarrayEvent.target === tippek // => true
  // Find out what changed: 
  // Log the Array-Delta Format to calculate the difference to the last observe-event
  console.log(yarrayEvent.changes.delta)
  console.log(tippek.toJSON());

  ul.innerHTML = genLista()
  console.log("Megváltozott az array");
})

szamkitalalosMap.observe(ymapEvent => {
    ymapEvent.target === szamkitalalosMap // => true
    // Find out what changed: 
    // Option 1: A set of keys that changed
    ymapEvent.keysChanged // => Set<strings>
    // Option 2: Compute the differences
    ymapEvent.changes.keys // => Map<string, { action: 'add'|'update'|'delete', oldValue: any}>
    // sample code.
    ymapEvent.changes.keys.forEach((change, key) => {
      if (change.action === 'add') {
        console.log(`Property "${key}" was added. Initial value: "${szamkitalalosMap.get(key)}".`)
      } else if (change.action === 'update') {
        console.log(`Property "${key}" was updated. New value: "${szamkitalalosMap.get(key)}". Previous value: "${change.oldValue}".`)
      } else if (change.action === 'delete') {
        console.log(`Property "${key}" was deleted. New value: undefined. Previous value: "${change.oldValue}".`)
      }
      
      
      
    })
    kitalalandoSzam = szamkitalalosMap.get("kitalalandoSzam");
    console.log("Végleges eredmény: " + kitalalandoSzam);
    console.log("Mapben az array: " + szamkitalalosMap.get("tippekArray"));
    ul.innerHTML = genLista()
    //input.disabled = szamkitalalosMap.get("inputIsDisabled")
    //gomb.disabled = szamkitalalosMap.get("gombIsDisabled")
  })

//szamkitalalosMap.set("name","Dávid")

function tippel(tippeltSzam) {
  /* Régi megoldás
  tippek.push([tippeltSzam])
  */
  tippekArray.push([tippeltSzam])
  szamkitalalosMap.set("tippekArray", tippekArray)
  let tempTippek = szamkitalalosMap.get("tippek")
  tempTippek = tempTippek + "," + tippeltSzam
  szamkitalalosMap.set("tippek", tempTippek)
  console.log('Ezt:' + typeof kitalalandoSzam[0] + "&&" + typeof tippeltSzam); 
  vege = tippeltSzam == kitalalandoSzam
}

gomb.addEventListener('click', tippeles)
function tippeles(e) {
  
  const szam = parseInt(input.value)

  tippel(szam)

  ul.innerHTML = genLista()

  
    console.log("vege: " + vege);
    //szamkitalalosMap.set("inputIsDisabled",[vege])
    input.disabled = vege
    //szamkitalalosMap.set("gombIsDisabled",[vege])
    gomb.disabled = vege
  
  
}

reset.addEventListener("click", ()=>{
  /* Régi megoldás
  tippek.delete(0,tippek.length)
  */
  tippekArray.delete(0,tippekArray.length)
  szamkitalalosMap.set("tippekArray",tippekArray)
  szamkitalalosMap.set("tippek", "")
  ul.innerHTML = genLista()
})

newGame.addEventListener("click", NewGame)
function genLista() {
  let tippek = szamkitalalosMap.get("tippek");
  vege = tippek.toArray().filter(szam => hasonlit(szam) == "egyenlő").length > 0
  input.disabled = vege
  gomb.disabled = vege
  return tippek.map(szam => `<li>${szam} (${hasonlit(szam)})</li>`).join("")
}

function NewGame() {
  
  vege = false
  //szamkitalalosMap.set("newGamePushed",[true])
  ul.innerHTML = ""
  input.disabled = false
  gomb.disabled = false
  /*Régi megoldás
  tippek.delete(0, tippek.length)
  */
  tippekArray.delete(0, tippekArray.length)
  szamkitalalosMap.set("tippekArray", tippekArray)
  szamkitalalosMap.set("tippek", "")
  kitalalandoSzam = veletlen(1, 100)
  console.log("Ezt kell kitalálni " + kitalalandoSzam);
  console.log(szamkitalalosMap.get("kitalalandoSzam"));
  szamkitalalosMap.set("kitalalandoSzam", [kitalalandoSzam])
  

  console.log("ténylegesen kitalálandó: " + kitalalandoSzam + " = " + szamkitalalosMap.get("kitalalandoSzam"));
  
  vege = false
}

function hasonlit(szam) {
  if(szam < kitalalandoSzam) return "nagyobb"
  if(szam > kitalalandoSzam) return "kisebb"
  return "egyenlő"
}

NewGame()