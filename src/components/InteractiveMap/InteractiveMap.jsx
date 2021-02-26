import * as THREE from 'three';

import Stats from 'three/examples/jsm/libs/stats.module.js';
import { GUI } from 'three/examples/jsm/libs/dat.gui.module.js';

import { Curves } from 'three/examples/jsm/curves/CurveExtras.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import React, { useEffect } from 'react';

const InteractiveMap = () => {
    let container, stats;

    let camera, scene, renderer, splineCamera, cameraHelper, cameraEye;

    const direction = new THREE.Vector3();
    const binormal = new THREE.Vector3();
    const normal = new THREE.Vector3();
    const position = new THREE.Vector3();
    const lookAt = new THREE.Vector3();

    // Keep a dictionary of Curve instances
    const splines = {
        GrannyKnot: new Curves.GrannyKnot()
    };

    let parent, tubeGeometry, mesh;

    const params = {
        spline: 'GrannyKnot',
        scale: 4,
        extrusionSegments: 100,
        radiusSegments: 3,
        closed: true,
        animationView: false,
        lookAhead: false,
        cameraHelper: false,
    };

    const material = new THREE.MeshLambertMaterial( { color: 0xff00ff } );

    const wireframeMaterial = new THREE.MeshBasicMaterial( { color: 0xffffff, opacity: 0.3, wireframe: true, transparent: true } );

    function addTube() {

        if ( mesh !== undefined ) {

            parent.remove( mesh );
            mesh.geometry.dispose();

        }

        const extrudePath = splines[ params.spline ];

        tubeGeometry = new THREE.TubeGeometry( extrudePath, params.extrusionSegments, 2, params.radiusSegments, params.closed );

        addGeometry( tubeGeometry );

        setScale();

    }

    function setScale() {

        mesh.scale.set( params.scale, params.scale, params.scale );

    }


    const addGeometry = geometry => {
        // 3D shape
        mesh = new THREE.Mesh( geometry, material );
        const wireframe = new THREE.Mesh( geometry, wireframeMaterial );
        mesh.add( wireframe );
        parent.add( mesh );

    }

    const animateCamera = () => {
        cameraHelper.visible = params.cameraHelper;
        cameraEye.visible = params.cameraHelper;

    }

    function init() {
        // camera

        camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.01, 10000 );
        camera.position.set( 0, 50, 500 );

        // scene

        scene = new THREE.Scene();
        scene.background = new THREE.Color( 0xf0f0f0 );

        // light

        const light = new THREE.DirectionalLight( 0xffffff );
        light.position.set( 0, 0, 1 );
        scene.add( light );

        // tube

        parent = new THREE.Object3D();
        scene.add( parent );

        splineCamera = new THREE.PerspectiveCamera( 20, window.innerWidth / window.innerHeight, 0.01, 500 );
        parent.add( splineCamera );

        cameraHelper = new THREE.CameraHelper( splineCamera );
        scene.add( cameraHelper );

        addTube();

        // debug camera

        cameraEye = new THREE.Mesh( new THREE.SphereGeometry( 5 ), new THREE.MeshBasicMaterial( { color: 0xdddddd } ) );
        parent.add( cameraEye );

        cameraHelper.visible = params.cameraHelper;
        cameraEye.visible = params.cameraHelper;

        // renderer

        renderer = new THREE.WebGLRenderer( { antialias: true } );
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth, window.innerHeight );
        document.body.appendChild( renderer.domElement );

        // stats

        stats = new Stats();
        document.body.appendChild( stats.dom );

        // dat.GUI

        const gui = new GUI( { width: 300 } );

        const folderGeometry = gui.addFolder( 'Geometry' );
        folderGeometry.add( params, 'spline', Object.keys( splines ) ).onChange( function () {

            addTube();

        } );
        folderGeometry.add( params, 'scale', 2, 10 ).step( 2 ).onChange( function () {

            setScale();

        } );
        folderGeometry.add( params, 'extrusionSegments', 50, 500 ).step( 50 ).onChange( function () {

            addTube();

        } );
        folderGeometry.add( params, 'radiusSegments', 2, 12 ).step( 1 ).onChange( function () {

            addTube();

        } );
        folderGeometry.add( params, 'closed' ).onChange( function () {

            addTube();

        } );
        folderGeometry.open();

        const folderCamera = gui.addFolder( 'Camera' );
        folderCamera.add( params, 'animationView' ).onChange( function () {

            animateCamera();

        } );
        folderCamera.add( params, 'lookAhead' ).onChange( function () {

            animateCamera();

        } );
        folderCamera.add( params, 'cameraHelper' ).onChange( function () {

            animateCamera();

        } );
        folderCamera.open();

        const controls = new OrbitControls( camera, renderer.domElement );
        controls.minDistance = 100;
        controls.maxDistance = 2000;

        window.addEventListener( 'resize', onWindowResize );

    }

    function onWindowResize() {

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize( window.innerWidth, window.innerHeight );

    }

    function render() {

        // animate camera along spline

        const time = Date.now();
        const looptime = 20 * 1000;
        const t = ( time % looptime ) / looptime;

        tubeGeometry.parameters.path.getPointAt( t, position );
        position.multiplyScalar( params.scale );

        // interpolation

        const segments = tubeGeometry.tangents.length;
        const pickt = t * segments;
        const pick = Math.floor( pickt );
        const pickNext = ( pick + 1 ) % segments;

        binormal.subVectors( tubeGeometry.binormals[ pickNext ], tubeGeometry.binormals[ pick ] );
        binormal.multiplyScalar( pickt - pick ).add( tubeGeometry.binormals[ pick ] );

        tubeGeometry.parameters.path.getTangentAt( t, direction );
        const offset = 15;

        normal.copy( binormal ).cross( direction );

        // we move on a offset on its binormal

        position.add( normal.clone().multiplyScalar( offset ) );

        splineCamera.position.copy( position );
        cameraEye.position.copy( position );

        // using arclength for stablization in look ahead

        tubeGeometry.parameters.path.getPointAt( ( t + 30 / tubeGeometry.parameters.path.getLength() ) % 1, lookAt );
        lookAt.multiplyScalar( params.scale );

        // camera orientation 2 - up orientation via normal

        if ( ! params.lookAhead ) lookAt.copy( position ).add( direction );
        splineCamera.matrix.lookAt( splineCamera.position, lookAt, normal );
        splineCamera.quaternion.setFromRotationMatrix( splineCamera.matrix );

        cameraHelper.update();

        renderer.render( scene, params.animationView === true ? splineCamera : camera );

    }

    //

    function animate() {

        requestAnimationFrame( animate );

        render();
        stats.update();

    }

    useEffect(() => {
        init();
        animate();
    }, []);

    return (
        <div>
            init();
            animate();
        </div>
    );
};

export default InteractiveMap;