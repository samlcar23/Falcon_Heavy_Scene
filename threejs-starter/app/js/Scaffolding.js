import { BoxGeometry, CylinderGeometry, MeshPhongMaterial, Mesh, Group} from 'three';
import * as THREE from "three";

export default class Scaffolding {
    constructor () { // number of spokes on the wheel

        const scaffoldGroup = new Group();

        const color = 0xd8d4d4;

        //verticals
        for (var i = 0; i < 4; i++){

            var geometry = new THREE.BoxGeometry(.1, .1, 20);
            var material = new THREE.MeshPhongMaterial({color: color});
            var rect = new THREE.Mesh(geometry, material);
            rect.translateZ(-9.5);
            rect.castShadow = true;

            switch(i) {
                case 0:
                    //back right
                    rect.translateX(1);
                    break;
                case 1:
                    //back left
                    rect.translateX(-1);
                    break;
                case 2:
                    //front right
                    rect.translateX(1);
                    rect.translateY(2);
                    break;
                case 3:
                    //front left
                    rect.translateX(-1);
                    rect.translateY(2);
                    break;
                default:
                    break;
            }

            scaffoldGroup.add(rect);
        }

        //back rungs
        for (var i = 0; i < 40; i++) {
            var geometry1 = new THREE.BoxGeometry(.1, .1, 2.1);
            var material1 = new THREE.MeshPhongMaterial({color: color});
            var back = new THREE.Mesh(geometry1, material1);
            back.rotateY(Math.PI / 2);
            back.translateX(i / 2);
            back.castShadow = true;

            scaffoldGroup.add(back);
        }

        //front rungs
        for (var i = 0; i < 40; i++) {
            var geometry2 = new THREE.BoxGeometry(.1, .1, 2.1);
            var material2 = new THREE.MeshPhongMaterial({color: color});
            var front = new THREE.Mesh(geometry2, material2);
            front.rotateY(Math.PI / 2);
            front.translateY(2);
            front.translateX(i / 2);
            front.castShadow = true;

            scaffoldGroup.add(front);
        }

        //left rungs
        for (var i = 0; i < 40; i++) {
            var geometry3 = new THREE.BoxGeometry(.1, .1, 2.1);
            var material3 = new THREE.MeshPhongMaterial({color: color});
            var left = new THREE.Mesh(geometry3, material3);
            left.rotateY(Math.PI / 2);
            left.rotateX(Math.PI / 2);
            left.translateY(-1);
            left.translateZ(-1);
            left.translateX(i / 2);
            left.castShadow = true;

            scaffoldGroup.add(left);
        }

        //right rungs
        for (var i = 0; i < 40; i++) {
            var geometry4 = new THREE.BoxGeometry(.1, .1, 2.1);
            var material4 = new THREE.MeshPhongMaterial({color: color});
            var right = new THREE.Mesh(geometry4, material4);
            right.rotateY(Math.PI / 2);
            right.rotateX(Math.PI / 2);
            right.translateY(1);
            right.translateZ(-1);
            right.translateX(i / 2);
            right.castShadow = true;

            scaffoldGroup.add(right);
        }




        return scaffoldGroup;   // the constructor must return the entire group
    }
}