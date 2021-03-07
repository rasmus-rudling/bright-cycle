import React, {useEffect} from 'react';
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

import blenderBox from '../../../resources/3Dassets/cube.gltf';

const BasicBoxExample = () => {
    // =========================
    // === ENVIRONMENT SETUP ===
    // =========================
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );


    const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 500 );
    camera.position.set( 0, 5, 7 );
    camera.lookAt( 0, 0, 0 );
    const scene = new THREE.Scene();

    // ============================
    // === ADD OBJECTS TO SCENE ===
    // ============================

    // === BLENDER LINE #1 ===
    const curve = new THREE.CatmullRomCurve3( [
        new THREE.Vector3 ( -3.121896266937256 ,  0.0 ,  1.2451393604278564 ) ,
        new THREE.Vector3 ( -2.9846599102020264 ,  0.0 ,  1.3161262273788452 ) ,
        new THREE.Vector3 ( -2.8258299827575684 ,  0.0 ,  1.2917957305908203 ) ,
        new THREE.Vector3 ( -2.6497249603271484 ,  0.0 ,  1.1912113428115845 ) ,
        new THREE.Vector3 ( -2.4606637954711914 ,  0.0 ,  1.0334365367889404 ) ,
        new THREE.Vector3 ( -2.262965202331543 ,  0.0 ,  0.8375349044799805 ) ,
        new THREE.Vector3 ( -2.060947895050049 ,  0.0 ,  0.6225697994232178 ) ,
        new THREE.Vector3 ( -1.8589305877685547 ,  0.0 ,  0.4076046943664551 ) ,
        new THREE.Vector3 ( -1.6612319946289062 ,  0.0 ,  0.2117030769586563 ) ,
        new THREE.Vector3 ( -1.4721708297729492 ,  0.0 ,  0.05392841994762421 ) ,
        new THREE.Vector3 ( -1.2960659265518188 ,  0.0 ,  -0.046655818819999695 ) ,
        new THREE.Vector3 ( -1.1372358798980713 ,  0.0 ,  -0.07098616659641266 ) ,
        new THREE.Vector3 ( -1.0 ,  0.0 ,  0.0 ) ,
        new THREE.Vector3 ( -0.8747106790542603 ,  0.0 ,  0.1050347164273262 ) ,
        new THREE.Vector3 ( -0.7476851940155029 ,  0.0 ,  0.1736111044883728 ) ,
        new THREE.Vector3 ( -0.6171875 ,  0.0 ,  0.2109374850988388 ) ,
        new THREE.Vector3 ( -0.48148149251937866 ,  0.0 ,  0.2222221940755844 ) ,
        new THREE.Vector3 ( -0.3388310372829437 ,  0.0 ,  0.21267355978488922 ) ,
        new THREE.Vector3 ( -0.1875000298023224 ,  0.0 ,  0.18749992549419403 ) ,
        new THREE.Vector3 ( -0.025752350687980652 ,  0.0 ,  0.15190961956977844 ) ,
        new THREE.Vector3 ( 0.14814810454845428 ,  0.0 ,  0.11111098527908325 ) ,
        new THREE.Vector3 ( 0.3359374403953552 ,  0.0 ,  0.07031235098838806 ) ,
        new THREE.Vector3 ( 0.5393518209457397 ,  0.0 ,  0.03472204878926277 ) ,
        new THREE.Vector3 ( 0.7601273059844971 ,  0.0 ,  0.009548412635922432 ) ,
        new THREE.Vector3 ( 1.0 ,  0.0 ,  0.0 ) ,
        new THREE.Vector3 ( 1.2285292148590088 ,  0.0 ,  0.05130252242088318 ) ,
        new THREE.Vector3 ( 1.4191688299179077 ,  0.0 ,  0.19313889741897583 ) ,
        new THREE.Vector3 ( 1.5794967412948608 ,  0.0 ,  0.407402366399765 ) ,
        new THREE.Vector3 ( 1.7170908451080322 ,  0.0 ,  0.6759861707687378 ) ,
        new THREE.Vector3 ( 1.839529037475586 ,  0.0 ,  0.9807834625244141 ) ,
        new THREE.Vector3 ( 1.9543893337249756 ,  0.0 ,  1.303687572479248 ) ,
        new THREE.Vector3 ( 2.0692496299743652 ,  0.0 ,  1.626591682434082 ) ,
        new THREE.Vector3 ( 2.191687822341919 ,  0.0 ,  1.9313889741897583 ) ,
        new THREE.Vector3 ( 2.329281806945801 ,  0.0 ,  2.199972629547119 ) ,
        new THREE.Vector3 ( 2.489609718322754 ,  0.0 ,  2.414236068725586 ) ,
        new THREE.Vector3 ( 2.6802492141723633 ,  0.0 ,  2.556072473526001 ) ,
        new THREE.Vector3 ( 2.908778667449951 ,  0.0 ,  2.607375144958496 )
    ] );
    const points = curve.getPoints( 50 );
    const geometry = new THREE.BufferGeometry().setFromPoints( points );
    const material = new THREE.LineBasicMaterial( { color : 0xff0000 } );

    // Create the final object to add to the scene
    const curveObject = new THREE.Line( geometry, material );

    scene.add( curveObject );

    // === BLENDER BOX WITH GLTF ===
    let blenderBoxObject;
    const loader = new GLTFLoader();

    loader.load(blenderBox, gltf => {
        const blenderBoxGeometry = gltf.scene.children[0].geometry;
        const blenderBoxMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        blenderBoxObject = new THREE.Mesh( blenderBoxGeometry, blenderBoxMaterial );
        blenderBoxObject.scale.set(0.2, 0.2, 0.2);
        console.log(gltf.scene);
        scene.add(blenderBoxObject);
    }, undefined, error => {
        console.error( error );
    });


    // ===============================
    // === ORBIT CONTROLS & RENDER ===
    // ===============================
    const controls = new OrbitControls( camera, renderer.domElement);

    const boxPosition = new THREE.Vector3();

    const render = () => {
        const time = Date.now();
        const looptime = 5 * 1000;
        const t = ( time % looptime ) / looptime;

        curve.getPointAt( t, boxPosition );
        if (blenderBoxObject !== undefined) {
            //blenderBoxObject.scale.set(0.2, 0.2, 0.2);
            //blenderBoxObject.position.set(boxPosition);
            //blenderBoxObject.position.set(0, 0, 0);
            blenderBoxObject.position.copy( boxPosition );
        }

        renderer.render( scene, camera );
    }

    const animate = () => {
        requestAnimationFrame( animate );
        controls.update();
        render();
    }


    useEffect(() => {
        document.body.appendChild( renderer.domElement );
        animate();
    }, []);
    
    return (
        <div>

        </div>
    );
}


export default BasicBoxExample;