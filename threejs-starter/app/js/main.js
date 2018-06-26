import * as THREE from 'three';
// import orbit from 'three-orbit-controls';
// const OrbitControls = orbit(THREE);
import TrackballControls from 'three-trackballcontrols';
import Wheel from './Wheel';
import FalconHeavy from "./FalconHeavy";
import LandingPad from "./LandingPad";
import Scaffolding from "./Scaffolding";
import {Matrix4} from "three";
import SideBooster from "./SideBooster";
import {Group} from "three";

import {TextureLoader} from 'three';
import grass from "/home/sam/Documents/school/cis367/MyFirstThreeJS/threejs-starter/images/grass.jpg";
import concrete from "/home/sam/Documents/school/cis367/MyFirstThreeJS/threejs-starter/images/concrete.jpg";
import song from "/home/sam/Documents/school/cis367/MyFirstThreeJS/threejs-starter/music/lifeOnMars.ogg";


var animRunning = false;
var wheelAnim = true;
var speed = .3;
var wheelRotSpeed = .1;
var cPos = new THREE.Vector3();
var rocketTrans = new Matrix4();
var rocketRotate = new Matrix4();
var rocx = 0, rocy = 0, rocz = 0;
var rocRx = 0, rocRy = 0, rocRz = 0;
var selector = "rocket";
var spotLight;
var lightOne;
var sliderSpeed = document.getElementById("speed");
var sliderSpot = document.getElementById("spot");
var sliderLight = document.getElementById("light");
var spotX = 0;
var lightX = 0;
var sound;


export default class App {

    constructor() {


        sliderSpeed.addEventListener('change', event => {
            speed = event.target.value;
            wheelRotSpeed = event.target.value - .2;
            sliderSpeed.blur();
        });
        sliderSpot.addEventListener('change', event => {
            spotX = event.target.value;
            spotLight.position.x = spotX;
            sliderSpot.blur();
        });
        sliderLight.addEventListener('change', event => {
            lightX = event.target.value;
            lightOne.position.x = lightX;
            sliderLight.blur();
        });

        document.getElementById("checkbox").addEventListener("click", event => {
            if (spotLight.intensity === 1.3) {
                spotLight.intensity = 0;
            } else {
                spotLight.intensity = 1.3;
            }
            document.getElementById("checkbox").blur();
        });
        document.getElementById("checkbox1").addEventListener("click", event => {
            if (lightOne.intensity === .3) {
                lightOne.intensity = 0;
            } else {
                lightOne.intensity = .3;
            }
            document.getElementById("checkbox1").blur();
        });



        const c = document.getElementById('mycanvas');
        // Enable antialias for smoother lines
        this.renderer = new THREE.WebGLRenderer({canvas: c, antialias: true});
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, 4/3, 0.5, 500);
        // this.camera.matrixAutoUpdate = false;
        // const transCam = new THREE.Matrix4().makeTranslation(0, 0, 50);
        // this.camera.matrixWorld.multiply(transCam);
        this.camera.position.z = 50;
        this.camera.getWorldPosition(cPos);

        // const orbiter = new OrbitControls(this.camera);
        // orbiter.enableZoom = false;
        // orbiter.update();
        this.tracker = new TrackballControls(this.camera, c);
        this.tracker.rotateSpeed = 2.0;
        this.tracker.noZoom = false;
        this.tracker.noPan = false;

        //event listener
        window.addEventListener("keydown", this.keydownHandler.bind(this));
        window.addEventListener("keyup", this.keyupHandler.bind(this));


        //Spotlight
        spotLight = new THREE.SpotLight( 0xffffff, 1.3 );
        spotLight.position.set(spotX, 40, 70 );
        spotLight.angle = Math.PI / 4;
        spotLight.penumbra = 0.05;
        spotLight.decay = 1.2;
        spotLight.distance = 200;
        spotLight.castShadow = true;
        spotLight.shadow.mapSize.width = 1024;
        spotLight.shadow.mapSize.height = 1024;
        spotLight.shadow.camera.near = .1;
        spotLight.shadow.camera.far = 200;
        this.scene.add( spotLight );

        //directional light
        lightOne = new THREE.DirectionalLight (0xFFFFFF, .3);
        lightOne.position.set (lightX, 30, 50);
        this.scene.add (lightOne);


        //Add FalconHeavy center to scene
        this.rocket = new FalconHeavy();
        this.rocket.matrixAutoUpdate = false;
        const rotX = new THREE.Matrix4().makeRotationX(this.degToRad(90));
        const trans = new THREE.Matrix4().makeTranslation(0, 0, .2);
        this.rocket.matrix.multiply(rotX);
        this.rocket.matrix.multiply(trans);
        this.scene.add(this.rocket);
        //this.rocket.getWorldPosition(rPos);

        //add left and right boosters to scene
        this.leftBooster = new SideBooster();
        this.leftBooster.matrixAutoUpdate = false;
        this.leftBooster.matrix.multiply(rotX);
        this.leftBooster.matrix.multiply(trans);
        const transLeft = new THREE.Matrix4().makeTranslation(-1.4, 0, 0);
        this.leftBooster.matrix.multiply(transLeft);
        this.scene.add(this.leftBooster);

        this.rightBooster = new SideBooster();
        this.rightBooster.matrixAutoUpdate = false;
        this.rightBooster.matrix.multiply(rotX);
        this.rightBooster.matrix.multiply(trans);
        const transRight = new THREE.Matrix4().makeTranslation(1.4, 0, 0);
        this.rightBooster.matrix.multiply(transRight);
        this.scene.add(this.rightBooster);


        this.rocketGroup = new Group();
        this.rocketGroup.add(this.leftBooster, this.rocket, this.rightBooster);
        this.rocketGroup.matrixAutoUpdate = false;

        this.scene.add(this.rocketGroup);




        //Add scaffolding to scene
        this.scaffold = new Scaffolding();
        this.scaffold.matrixAutoUpdate = false;
        const trans1 = new THREE.Matrix4().makeTranslation(0, -3, 0);
        this.scaffold.matrix.multiply(rotX);
        this.scaffold.matrix.multiply(trans1);
        this.scene.add(this.scaffold);
        //this.scaffold.getWorldPosition(sPos);


        //add textures
        var grassTex = new THREE.TextureLoader().load(grass);
        grassTex.wrapS = THREE.RepeatWrapping;
        grassTex.wrapT = THREE.RepeatWrapping;
        grassTex.repeat.x = 20;
        grassTex.repeat.y = 20;

        var concreteTex = new THREE.TextureLoader().load(concrete);
        concreteTex.wrapS = THREE.RepeatWrapping;
        concreteTex.wrapT = THREE.RepeatWrapping;
        concreteTex.repeat.x = 20;
        concreteTex.repeat.y = 20;

        var concreteTex2 = new THREE.TextureLoader().load(concrete);
        concreteTex2.wrapS = THREE.RepeatWrapping;
        concreteTex2.wrapT = THREE.RepeatWrapping;
        concreteTex2.repeat.x = 10;
        concreteTex2.repeat.y = 40;

        //grass land
        var geometry = new THREE.PlaneGeometry( 200, 200);
        var material = new THREE.MeshPhongMaterial({
                color: 0x04770c,
                map: grassTex,
                shininess: 0,
                side: THREE.DoubleSide
                });
        var plane = new THREE.Mesh( geometry, material );
        plane.receiveShadow = true;
        plane.rotateX(Math.PI / 2);
        plane.translateZ(.5);
        this.scene.add(plane);

        //concrete pad
        var geometry1 = new THREE.PlaneGeometry(20, 20);
        var material1 = new THREE.MeshPhongMaterial({
                color: 0x727573,
                map: concreteTex,
                shininess: 0,
                side: THREE.DoubleSide
                });
        var plane1 = new THREE.Mesh(geometry1, material1);
        plane1.receiveShadow = true;
        plane1.rotateX(Math.PI / 2);
        plane1.translateZ(.45);
        this.scene.add(plane1);

        //pathway
        var geometry2 = new THREE.PlaneGeometry(10, 50);
        var material2 = new THREE.MeshPhongMaterial({
            color: 0x727573,
            map: concreteTex2,
            shininess: 0,
            side: THREE.DoubleSide
        });
        var plane2 = new THREE.Mesh(geometry2, material2);
        plane2.receiveShadow = true;
        plane2.rotateX(Math.PI / 2);
        plane2.translateY(-35);
        plane2.translateZ(.45);
        this.scene.add(plane2);

        //Hanger
        var geometry3 = new THREE.BoxGeometry(30, 15, 40);
        var material3 = new THREE.MeshPhongMaterial({color: 0x827f7f, shininess: 0});
        var hanger = new THREE.Mesh(geometry3, material3);
        hanger.translateZ(-80);
        hanger.translateY(15 / 2.2);
        hanger.castShadow = true;
        hanger.receiveShadow = true;
        this.scene.add(hanger);

        //Add pad1 to scene
        this.pad1 = new LandingPad();
        this.pad1.rotateX(Math.PI / 2);
        this.pad1.rotateZ(Math.PI);
        this.pad1.translateZ(.45);
        this.pad1.translateX(30);
        this.pad1.translateY(-58);
        this.scene.add(this.pad1);

        //Add pad2 to scene
        this.pad2 = new LandingPad();
        this.pad2.rotateX(Math.PI / 2);
        this.pad2.rotateZ(Math.PI);
        this.pad2.translateZ(.45);
        this.pad2.translateX(-30);
        this.pad2.translateY(-58);
        this.scene.add(this.pad2);

        //add wheel
        this.wheel = new Wheel(5);
        this.wheel.matrixAutoUpdate = false;
        var transWheel = new THREE.Matrix4().makeTranslation(-50, 5.3, -50);
        this.wheel.matrix.multiply(transWheel);

        this.wheelGroup = new Group();
        this.wheelGroup.add(this.wheel);
        this.wheelGroup.matrixAutoUpdate = false;

        this.scene.add(this.wheelGroup);


        // var helper = new THREE.CameraHelper(spotLight.shadow.camera);
        // this.scene.add(helper);

        // create an AudioListener and add it to the camera
        var listener = new THREE.AudioListener();
        this.camera.add( listener );

        // create a global audio source
        sound = new THREE.Audio( listener );

        // load a sound and set it as the Audio object's buffer
        var audioLoader = new THREE.AudioLoader();
        audioLoader.load( song, function( buffer ) {
            sound.setBuffer( buffer );
            sound.setLoop( true );
            sound.setVolume( 0.5 );
            sound.hasPlaybackControl = true;
        });



        window.addEventListener('resize', () => this.resizeHandler());
        this.resizeHandler();
        requestAnimationFrame(() => this.render());
    }

    render() {
        this.renderer.render(this.scene, this.camera);
        this.tracker.update();

        if(animRunning) {
            this.animationSequence();
            this.cameraAnimationSequence();
        }

        rocketTrans.makeTranslation(rocx, rocy, rocz);
        if(selector === "rocket") {
            this.rocketGroup.matrix.multiply(rocketTrans);
        } else if (selector === "scaffold"){
            this.scaffold.matrix.multiply(rocketTrans)
        }else {
            this.camera.matrixWorld.multiply(rocketTrans);
        }

        rocketRotate.makeRotationX(this.degToRad(rocRx));
        if(selector === "rocket") {
            this.rocketGroup.matrix.multiply(rocketRotate);
        }else if (selector === "scaffold"){
            this.scaffold.matrix.multiply(rocketRotate);
        }else {
            this.camera.matrixWorld.multiply(rocketRotate);
        }

        rocketRotate.makeRotationY(this.degToRad(rocRy));
        if(selector === "rocket") {
            this.rocketGroup.matrix.multiply(rocketRotate);
        }else if (selector === "scaffold"){
            this.scaffold.matrix.multiply(rocketRotate);
        }else {
            this.camera.matrixWorld.multiply(rocketRotate);
        }

        rocketRotate.makeRotationZ(this.degToRad(rocRz));
        if(selector === "rocket") {
            this.rocketGroup.matrix.multiply(rocketRotate);
        }else if (selector === "scaffold"){
            this.scaffold.matrix.multiply(rocketRotate);
        }else {
            this.camera.matrixWorld.multiply(rocketRotate);
        }



        //Rotate wheel
        if(wheelAnim) {
            this.moveWheel(speed);
            this.turnWheel(-speed * .4);
        }


        requestAnimationFrame(() => this.render());
    }

    moveWheel(distance){
        const trans = new Matrix4().makeTranslation(distance,0,0);
        this.wheelGroup.matrix.multiply(trans);
        const wheelRot = speed / 5;   // wheel radius 150
        const rotation = new Matrix4().makeRotationZ(-wheelRot);
        this.wheel.matrix.multiply(rotation);
    }
    turnWheel(angle){
        const rot = new Matrix4().makeRotationY(this.degToRad(angle));
        this.wheelGroup.matrix.multiply(rot);
    }

    resizeHandler() {
        const canvas = document.getElementById("mycanvas");
        let w = window.innerWidth - 16;
        let h = 0.75 * w;  /* maintain 4:3 ratio */
        if (canvas.offsetTop + h > window.innerHeight) {
            h = window.innerHeight - canvas.offsetTop - 16;
            w = 4/3 * h;
        }
        canvas.width = w;
        canvas.height = h;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(w, h);
        this.tracker.handleResize();
    }

    async animationSequence(){

        //bring out of hanger
        this.moveRocket(0, 0, .1, "rocket");
        this.moveScaffolding(0, 0, .1);
        await this.sleep(10000);
        this.moveRocket(0, 0, -.1, "rocket");
        this.moveScaffolding(0, 0, -.1);

        //stand upright
        this.rotateRocket("x", .2, "rocket");
        this.rotateScaffold("x", .2);
        this.moveRocket(0, 0, .01, "rocket");
        await this.sleep(7500);
        this.moveRocket(0, 0, -.01, "rocket");
        this.rotateRocket("x", -.2, "rocket");
        this.rotateScaffold("x", -.2);

        //launch rocket
        await this.sleep(2000);
        this.moveRocket(0, 0, -.2, "rocket");
        await this.sleep(10000);
        this.moveRocket(0, 0, .2, "left");
        this.moveRocket(0, 0, .2, "right");

        //seperation
        this.rotateRocket("y", .2, "left");
        this.rotateRocket("y", -.2, "right");
        this.moveRocket(-.1, 0, 0, "left");
        await this.sleep(2000);
        this.rotateRocket("y", -.2, "left");
        this.rotateRocket("y", .2, "right");
        this.moveRocket(.1, 0, 0, "left");

        //landing rocket
        this.moveRocket(-.05, .1, .2, "left");
        this.rotateRocket("y", -.05, "left");
        this.moveRocket(.1, .1, .2, "right");
        this.rotateRocket("y", .05, "right");
        await this.sleep(9500);
        this.moveRocket(.05, -.1, -.2, "left");
        this.rotateRocket("y", .05, "left");
        this.moveRocket(-.1, -.1, -.2, "right");
        this.rotateRocket("y", -.05, "right");
        this.moveRocket(0, 0, .2, "center");

        await this.sleep(3000);
        location.reload();



    }

    async cameraAnimationSequence() {

        //first move
        this.moveCamera(-.2, .05, -.2);
        this.rotateCamera("y", -.2);
        await this.sleep(4000);
        this.moveCamera(.2, -.05, .2);
        this.rotateCamera("y", .2);

        //second move
        this.rotateCamera("y", -.5);
        this.moveCamera(-.2, 0, -.15);
        await this.sleep(10000);
        this.rotateCamera("y", .5);
        this.moveCamera(.2, 0, .15);

        //third move
        this.moveCamera(0, 0, .05);
        this.rotateCamera("y", -.1);
        await this.sleep(5000);
        this.moveCamera(0, 0, -.05);
        this.rotateCamera("y", .1);

        //fourth move - launch
        this.moveCamera(0, .18, 0);
        await this.sleep(11000);
        this.moveCamera(0, -.18, 0);

        //fifth move - landing
        this.moveCamera(0, -.2, .05);
        this.rotateCamera("y", .15);
        await this.sleep(10000);
        this.moveCamera(0, .2, -.05);
        this.rotateCamera("y", -.15);


    }


    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    moveCamera(x, y, z){
        const transCam = new Matrix4().makeTranslation(x, y, z);
        this.camera.matrixWorld.multiply(transCam);

    }

    rotateCamera(axis, degrees){
        switch(axis){
            case "x":
                const rotX = new Matrix4().makeRotationX(this.degToRad(degrees));
                this.camera.matrixWorld.multiply(rotX);
                break;
            case "y":
                const rotY = new Matrix4().makeRotationY(this.degToRad(degrees));
                this.camera.matrixWorld.multiply(rotY);
                break;

            case "z":
                const rotZ = new Matrix4().makeRotationZ(this.degToRad(degrees));
                this.camera.matrixWorld.multiply(rotZ);
                break;
            default:
                break;
        }
    }

    moveRocket(x, y, z, part){
        const trans = new Matrix4().makeTranslation(x, y, z);
        if(part === "rocket") {
            this.rocket.matrix.multiply(trans);
            this.leftBooster.matrix.multiply(trans);
            this.rightBooster.matrix.multiply(trans);
        }else if(part === "left"){
            this.leftBooster.matrix.multiply(trans);
        }else if(part === "right"){
            this.rightBooster.matrix.multiply(trans);
        }else{//center
            this.rocket.matrix.multiply(trans);
        }
    }

    moveScaffolding(x, y, z){
        const trans = new Matrix4().makeTranslation(x, y, z);
        this.scaffold.matrix.multiply(trans);
    }

    rotateRocket(axis, degrees, part){
        switch(axis){
            case "x":
                const rotX = new Matrix4().makeRotationX(this.degToRad(degrees));
                if(part === "rocket") {
                    this.rocket.matrix.multiply(rotX);
                    this.leftBooster.matrix.multiply(rotX);
                    this.rightBooster.matrix.multiply(rotX);
                }else if(part === "left"){
                    this.leftBooster.matrix.multiply(rotX);
                }else{//right
                    this.rightBooster.matrix.multiply(rotX);
                }
                break;
            case "y":
                const rotY = new Matrix4().makeRotationY(this.degToRad(degrees));
                if(part === "rocket") {
                    this.rocket.matrix.multiply(rotY);
                    this.leftBooster.matrix.multiply(rotY);
                    this.rightBooster.matrix.multiply(rotY);
                }else if(part === "left"){
                    this.leftBooster.matrix.multiply(rotY);
                }else{//right
                    this.rightBooster.matrix.multiply(rotY);
                }
                break;

            case "z":
                const rotZ = new Matrix4().makeRotationZ(this.degToRad(degrees));
                if(part === "rocket") {
                    this.rocket.matrix.multiply(rotZ);
                    this.leftBooster.matrix.multiply(rotZ);
                    this.rightBooster.matrix.multiply(rotZ);
                }else if(part === "left"){
                    this.leftBooster.matrix.multiply(rotZ);
                }else{//right
                    this.rightBooster.matrix.multiply(rotZ);
                }
                break;
            default:
                break;
        }
    }

    rotateScaffold(axis, degrees){
        switch(axis){
            case "x":
                const rotX = new Matrix4().makeRotationX(this.degToRad(degrees));
                this.scaffold.matrix.multiply(rotX);
                break;
            case "y":
                const rotY = new Matrix4().makeRotationY(this.degToRad(degrees));
                this.scaffold.matrix.multiply(rotY);
                break;

            case "z":
                const rotZ = new Matrix4().makeRotationZ(this.degToRad(degrees));
                this.scaffold.matrix.multiply(rotZ);
                break;
            default:
                break;
        }
    }

    keydownHandler(event){

        var input = String.fromCharCode(event.keyCode);

        switch(input) {
            case "W":
                rocRx = -1;
                break;
            case "A":
                rocx = -.2;
                break;
            case "S":
                rocRx = 1;
                break;
            case "D":
                rocx = .2;
                break;
            case "Q":
                if(selector === "rocket" || selector === "camera"){
                    rocRy = 1;
                }else {
                    rocRz = 1;
                }
                break;
            case "E":
                if(selector === "rocket" || selector === "camera"){
                    rocRy = -1;
                }else {
                    rocRz = -1;
                }
                break;
            case "&":
                if(selector === "scaffold" || selector === "camera"){
                    rocz = -.2;
                }else {
                    rocy = .2;
                }
                break;
            case "(":
                if(selector === "scaffold" || selector === "camera"){
                    rocz = .2;
                }else {
                    rocy = -.2;
                }
                break;
            case "%":
                if(selector === "rocket" || selector === "camera"){
                    rocRz = 1;
                }else {
                    rocRy = 1;
                }
                break;
            case "'":
                if(selector === "rocket" || selector === "camera"){
                    rocRz = -1;
                }else {
                    rocRy = -1;
                }
                break;
            case "P":
                wheelAnim = !wheelAnim;
                break;
            case "M":
                if(sound.isPlaying){
                    sound.pause();
                }else{
                    sound.play();
                }
                break;
            case " ":
                // toggle animation
                if(sound.isPlaying){sound.stop();}
                sound.offset = 33;
                sound.play();

                if(animRunning){

                    location.reload();

                } else {

                    //move objects to starting position
                    const rotX = new THREE.Matrix4().makeRotationX(this.degToRad(-90));
                    const trans = new THREE.Matrix4().makeTranslation(0,3.1, -3);
                    const trans1 = new THREE.Matrix4().makeTranslation(0,0, -60);
                    this.rocket.matrix.multiply(rotX);
                    this.leftBooster.matrix.multiply(rotX);
                    this.rightBooster.matrix.multiply(rotX);
                    //rRotArray.push(rotX);
                    this.rocket.matrix.multiply(trans);
                    this.leftBooster.matrix.multiply(trans);
                    this.rightBooster.matrix.multiply(trans);
                    this.scaffold.matrix.multiply(rotX);
                    //sRotArray.push(rotX);
                    this.rocket.matrix.multiply(trans1);
                    this.leftBooster.matrix.multiply(trans1);
                    this.rightBooster.matrix.multiply(trans1);
                    this.scaffold.matrix.multiply(trans1);

                    //move camera to original position
                    this.camera.position.x = 0;
                    this.camera.position.y = 0;
                    this.camera.position.z = 50;
                    this.camera.up = new THREE.Vector3(0, 1, 0);

                    //wait for previous translation
                    //then move camera to animation location
                    this.turnOffCamMatrixAutoUpdate();

                    animRunning = true;
                }
                break;
            case "1":
                this.camera.matrixAutoUpdate = true;
                this.objectSelect("rocket");
                break;
            case "2":
                this.camera.matrixAutoUpdate = true;
                this.objectSelect("scaffold");
                break;
            case "3":
                this.camera.matrixAutoUpdate = false;
                this.objectSelect("camera");
                break;
            default:

                break;
        }
    }

    keyupHandler(event){

        var input = String.fromCharCode(event.keyCode);

        switch(input) {
            case "W":
                rocRx = 0;
                break;
            case "A":
                rocx = 0;
                break;
            case "S":
                rocRx = 0;
                break;
            case "D":
                rocx = 0;
                break;
            case "Q":
                if(selector === "rocket" || selector === "camera"){
                    rocRy = 0;
                }else {
                    rocRz = 0;
                }
                break;
            case "E":
                if(selector === "rocket" || selector === "camera"){
                    rocRy = 0;
                }else {
                    rocRz = 0;
                }
                break;
            case "&":
                if(selector === "scaffold" || selector === "camera"){
                    rocz = 0;
                }else {
                    rocy = 0;
                }
                break;
            case "(":
                if(selector === "scaffold" || selector === "camera"){
                    rocz = 0;
                }else {
                    rocy = 0;
                }
                break;
            case "%":
                if(selector === "rocket" || selector === "camera"){
                    rocRz = 0;
                }else {
                    rocRy = 0;
                }
                break;
            case "'":
                if(selector === "rocket" || selector === "camera"){
                    rocRz = 0;
                }else {
                    rocRy = 0;
                }
                break;
            case " ":

                break;
            default:

                break;
        }
    }

    async turnOffCamMatrixAutoUpdate(){
        await this.sleep(100);
        this.camera.matrixAutoUpdate = false;
    }

  objectSelect(object){
        if (object === "scaffold") {
            selector = "scaffold";
        } else if (object === "rocket") {
            selector = "rocket";
        } else if (object === "camera") {
            selector = "camera";
        } else {
            console.log("Error in objectSelect(object)");
        }
    }


    degToRad(degrees){
        return degrees * Math.PI / 180;
    }

}





