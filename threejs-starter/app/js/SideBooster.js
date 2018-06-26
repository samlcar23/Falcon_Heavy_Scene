import { LatheGeometry, CylinderGeometry, SphereGeometry, MeshPhongMaterial, Mesh, Group, Vector2, Matrix4} from 'three';
import * as THREE from "three";

/**
 * Let's make a rocket
 */
export default class SideBooster {

    constructor() {

        /***************************************************************************************
         * Rough scale info: 10ft = 1.0
         * Example: a booster is roughly 3ft tall so 3/10 = 0.3 so the boosters height is 0.3
         * Left & Right Rocket Cylinders: Height = 133ft/10 = 13.3; Radius = 11ft/10 = 1.1/2 = .55
         * Center Rocket Cylinder: Height = 187ft/10 = 18.7; Radius = 11ft/10 = 1.1/2 = .55
         **************************************************************************************/
        const booster = new Group();

        //Group for the booster arrays
        let boosterGroup =  new Group();

        //Group for rocket cylinder
        let rocketGroup =  new Group();

        //Group for the topper
        let topperGroup = new Group();

        //make objects
        boosterGroup = this.makeBoosterArray(0,0);

        rocketGroup = this.makeRocketCylinder(13.3, true);

        topperGroup = this.makeTopper();

        //topperGroup.translateX(-1.5);
        topperGroup.translateZ(-13.3);


        booster.add(boosterGroup, rocketGroup, topperGroup);

        return booster;
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


        let geometry = new CylinderGeometry(.55, .55, height, 40);
        let material = new MeshPhongMaterial({color: 0xbdbfc1, shininess: 10});
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
