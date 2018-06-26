import { TorusGeometry, CylinderGeometry, MeshPhongMaterial, Mesh, Group} from 'three';
import * as THREE from 'three';
import {TextureLoader} from 'three';
import landingPad from "/home/sam/Documents/school/cis367/MyFirstThreeJS/threejs-starter/images/landingpad1scaled.png";

export default class LandingPad {
    constructor () { // number of spokes on the wheel

        const padGroup = new Group();

        //import image
        //const image1 = THREE.TextureLoader("images/landingpad1scaled.png");
        var texture = new THREE.TextureLoader().load(landingPad);

        //landing pad
        var geometry = new THREE.CircleGeometry( 8, 32 );
        var material = new THREE.MeshPhongMaterial({
            color: 0x9b9898,
            map: texture,
            shininess: 0,
            side: THREE.DoubleSide
        });
        var pad = new THREE.Mesh( geometry, material);
        pad.receiveShadow = true;
        padGroup.add(pad);


        return padGroup;   // the constructor must return the entire group
    }
}