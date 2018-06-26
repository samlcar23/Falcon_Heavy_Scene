import { LatheGeometry, CylinderGeometry, SphereGeometry, MeshPhongMaterial, Mesh, Group, Vector2, Matrix4} from 'three';
import * as THREE from "three";
import logo1 from "/home/sam/Documents/school/cis367/MyFirstThreeJS/threejs-starter/images/spacexlogoscaled2.png";
import logo2 from "/home/sam/Documents/school/cis367/MyFirstThreeJS/threejs-starter/images/falconheavylogoscaled.jpg";

/**
 * Let's make a rocket
 */
export default class FalconHeavy {

    constructor() {

        /***************************************************************************************
         * Rough scale info: 10ft = 1.0
         * Example: a booster is roughly 3ft tall so 3/10 = 0.3 so the boosters height is 0.3
         * Left & Right Rocket Cylinders: Height = 133ft/10 = 13.3; Radius = 11ft/10 = 1.1/2 = .55
         * Center Rocket Cylinder: Height = 187ft/10 = 18.7; Radius = 11ft/10 = 1.1/2 = .55
         **************************************************************************************/
        const rocketGroup = new Group();

        //Groups for the booster arrays
        //let leftBoosterGroup = new Group();
        let centerBoosterGroup =  new Group();
        //let rightBoosterGroup =  new Group();

        //Groups for the rocket cylinders
        //let leftRocketGroup =  new Group();
        let centerRocketGroup =  new Group();
        //let rightRocketGroup =  new Group();

        //Group for fairing on top of center rocket
        let fairingGroup =  new Group();

        //Group for rocket cylinder toppers
        //let leftRocketTopperGroup =  new Group();
        //let rightRocketTopperGroup = new Group();

        //Create the boosters for each rocket cylinder
        //leftBoosterGroup = this.makeBoosterArray(0,0);
        centerBoosterGroup = this.makeBoosterArray(0,0);
        //rightBoosterGroup = this.makeBoosterArray(0,0);

        //leftBoosterGroup.translateX(-1.5);
        //rightBoosterGroup.translateX(1.5);

        //Create the rocket cylinders
        //leftRocketGroup = this.makeRocketCylinder(13.3, false);
        centerRocketGroup = this.makeRocketCylinder(18.7, true);
        //rightRocketGroup = this.makeRocketCylinder(13.3, false);

        //leftRocketGroup.translateX(-1.5);
        //rightRocketGroup.translateX(1.5);

        //Create the fairing for the center rocket
        fairingGroup = this.makeFairing();
        fairingGroup.translateZ(-18.7);

        //Create the topper for left and right rockets
        //leftRocketTopperGroup = this.makeTopper();
        //rightRocketTopperGroup = this.makeTopper();

        //leftRocketTopperGroup.translateX(-1.5);
        //leftRocketTopperGroup.translateZ(-13.3);
        //rightRocketTopperGroup.translateX(1.5);
        //rightRocketTopperGroup.translateZ(-13.3);


        // Create support bars
        let geometry = new CylinderGeometry(.05, .05, 3, 20);
        let material = new MeshPhongMaterial({color: 0x3f4042});
        let support1 = new Mesh(geometry, material);
        support1.rotateZ(Math.PI / 2);
        support1.translateX(.6);
        support1.translateZ(-13.2);

        let geometry1 = new CylinderGeometry(.05, .05, 3, 20);
        let material1 = new MeshPhongMaterial({color: 0x3f4042});
        let support2 = new Mesh(geometry1, material1);
        support2.rotateZ(Math.PI / 2);
        support2.translateX(-.6);
        support2.translateZ(-13.2);

        rocketGroup.add(/*leftBoosterGroup, rightBoosterGroup,*/ centerBoosterGroup,
            /*leftRocketGroup,*/ centerRocketGroup, /*rightRocketGroup,*/
            fairingGroup, /*leftRocketTopperGroup , rightRocketTopperGroup,*/ support1, support2);

        //rocketGroup.rotateX(-Math.PI / 2);

        return rocketGroup;
    }


    makeBoosterArray(x, y){

        // Group to hold all boosters from this call
        let boosterGroup =  new Group();

        //grey
        //var color = new MeshPhongMaterial ({color: 0x82332a});

        //temp variables for booster placement
        var temp1 = 0.4;
        var temp2 = 0.15;

        //create 9 boosters in formation
        for (var k = 0; k < 9; k++){
            let geometry = new CylinderGeometry(.05, .15, .25, 20);
            let material = new MeshPhongMaterial({color: 0x2c2c2d, shininess: 0});
            let booster = new Mesh(geometry, material);

            //center booster
            if(k === 0) {
                booster.translateX(x);
                booster.translateY(y);
                //surrounding boosters
            } else if (k < 5) {
                booster.translateX(temp1);
                booster.translateY(temp2);
                temp1 = temp1 * -1;
                var t = temp1;
                temp1 = temp2;
                temp2 = t;
            } else{
                booster.translateX(temp2);
                booster.translateY(temp1);
                temp1 = temp1 * -1;
                var t = temp1;
                temp1 = temp2;
                temp2 = t;
            }

            booster.rotateX(-Math.PI / 2);
            booster.translateY(-.1);
            // Push the single booster to the booster group
            boosterGroup.add(booster);
        }

        // Return the whole group to me manipulated later.
        return boosterGroup;
    }

    //Create a function that makes the Rocket cylinders. Maybe add all the little things to them in this function too?
    //adding all the little stuff here seems like a good idea to me.
    //TODO: Figure out a way to skin the cylinder with an image instead of trying to use shapes for SPACEX?
    makeRocketCylinder(height, center){

        // Group to hold all rocket cylinder parts from this call
        let rocketGroup = new Group();

        var texture = new THREE.TextureLoader().load(logo1);

        let geometry = new CylinderGeometry(.55, .55, height, 40);
        let material;
        if(center) {
            material = new MeshPhongMaterial({color: 0xffffff, map: texture, shininess: 10});
        } else {                                     //d9dbe0
            material = new MeshPhongMaterial({color: 0xbdbfc1, shininess: 10});
        }
        let rocketCylinder = new Mesh(geometry, material);

        rocketCylinder.rotateX(-Math.PI / 2);
        rocketCylinder.rotateY(Math.PI + .1);
        rocketCylinder.translateY(height / 2);
        rocketCylinder.castShadow = true;

        // Create 4 fins for bottom of cylinder
        let geometry1 = new CylinderGeometry(.01, .2, 6, 30);
        let material1 = new MeshPhongMaterial({color: 0x3f4042, shininess: 0});
        let fin1 = new Mesh(geometry1, material1);

        let geometry2 = new CylinderGeometry(.01, .2, 6, 30);
        let material2 = new MeshPhongMaterial({color: 0x3f4042, shininess: 0});
        let fin2 = new Mesh(geometry2, material2);

        let geometry3 = new CylinderGeometry(.01, .2, 6, 30);
        let material3 = new MeshPhongMaterial({color: 0x3f4042, shininess: 0});
        let fin3 = new Mesh(geometry3, material3);

        let geometry4 = new CylinderGeometry(.01, .2, 6, 30);
        let material4 = new MeshPhongMaterial({color: 0x3f4042, shininess: 0});
        let fin4 = new Mesh(geometry4, material4);

        // Position fins
        fin1.translateX(-.46);
        fin1.translateZ(-3.1);
        fin1.rotateX(-Math.PI / 2);

        fin2.translateY(.46);
        fin2.translateZ(-3.1);
        fin2.rotateX(-Math.PI / 2);

        fin3.translateX(.46);
        fin3.translateZ(-3.1);
        fin3.rotateX(-Math.PI / 2);

        fin4.translateY(-.46);
        fin4.translateZ(-3.1);
        fin4.rotateX(-Math.PI / 2);

        rocketGroup.add(rocketCylinder, fin1, fin2, fin3, fin4);

        return rocketGroup;
    }

    makeFairing(){

        let fairingGroup = new Group();

        //import image
        var texture = new THREE.TextureLoader().load(logo2);

        //left connector
        let lcGeometry = new CylinderGeometry(.8, .55, .5, 40, 1, false, 0, Math.PI);
        let lcMaterial = new MeshPhongMaterial({color: 0xbdbfc1, shininess: 10});
        let leftConnector = new Mesh(lcGeometry, lcMaterial);
        leftConnector.rotateX(-Math.PI / 2);
        leftConnector.castShadow = true;

        //right connector
        let rcGeometry = new CylinderGeometry(.8, .55, .5, 40, 1, false, 0, Math.PI);
        let rcMaterial = new MeshPhongMaterial({color: 0xbdbfc1, shininess: 10});
        let rightConnector = new Mesh(rcGeometry, rcMaterial);
        rightConnector.rotateX(-Math.PI / 2);
        rightConnector.rotateZ(Math.PI * 2);
        rightConnector.rotateY(Math.PI);
        rightConnector.castShadow = true;

        //left body
        let lbGeometry = new CylinderGeometry(.8, .8, 2.1, 40, 1, false, 0, Math.PI);
        let lbMaterial = new MeshPhongMaterial({color: 0xbdbfc1, map: texture, shininess: 10});
        let leftBody = new Mesh(lbGeometry, lbMaterial);
        leftBody.rotateX(-Math.PI / 2);
        leftBody.rotateY(-Math.PI / 1.6);
        leftBody.translateY(1.3);
        leftBody.castShadow = true;

        //right body
        let rbGeometry = new CylinderGeometry(.8, .8, 2.1, 40, 1, false, 0, Math.PI);
        let rbMaterial = new MeshPhongMaterial({color: 0xbdbfc1, shininess: 10});
        let rightBody = new Mesh(rbGeometry, rbMaterial);
        rightBody.rotateX(-Math.PI / 2);
        rightBody.rotateY(Math.PI / 2.666665);
        rightBody.translateY(1.3);
        rightBody.castShadow = true;

        fairingGroup.add(leftConnector, rightConnector, leftBody, rightBody);

        var points = [];
        for ( var i = 0; i < 10; i ++ ) {
            points.push(new Vector2( Math.sin( i * .2 ) * .653 + .15, ( i - 5 ) * .2 ) );
        }

        let geometry2 = new LatheGeometry(points, 40, 10);
        let material2 = new MeshPhongMaterial({color: 0xbdbfc1, shininess: 10});
        let top = new Mesh(geometry2, material2);
    /**/    top.rotateX(Math.PI / 2);
        top.translateY(-2.93);
        top.castShadow = true;

        fairingGroup.add(top);

        let geometry3 = new SphereGeometry(.201, 30, 30, 0, Math.PI * 2, 0, .85);
        let material3 = new MeshPhongMaterial({color: 0xbdbfc1, shininess: 10});
        let sphere = new Mesh(geometry3, material3);
        sphere.rotateX(-Math.PI / 2);
        sphere.translateY(3.794);

        fairingGroup.add(sphere);

        return fairingGroup;
    }

    makeTopper(){

        let topperGroup = new Group();

        var points = [];
        for ( var i = 0; i < 10; i ++ ) {
            points.push(new Vector2( Math.sin( i * .2 ) * .401 + .15, ( i - .5 ) * .1 ) );
        }

        let geometry2 = new LatheGeometry(points, 40, 10);
        let material2 = new MeshPhongMaterial({color: 0xbdbfc1, shininess: 10});
        let top = new Mesh(geometry2, material2);
   /**/     top.rotateX(Math.PI / 2);
        top.translateY(-.75);
        top.castShadow = true;
        topperGroup.add(top);

        let geometry3 = new SphereGeometry(.201, 30, 30, 0, Math.PI * 2, 0, .85);
        let material3 = new MeshPhongMaterial({color: 0xbdbfc1, shininess: 10});
        let sphere = new Mesh(geometry3, material3);
   /**/     sphere.rotateX(-Math.PI / 2);
        sphere.translateY(.665);

        topperGroup.add(sphere);

        return topperGroup;
    }
}
