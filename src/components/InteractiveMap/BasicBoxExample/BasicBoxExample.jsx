import React from 'react';
import * as THREE from "three";

const BasicBoxExample = () => {

  let camera, scene, renderer, splineCamera, cameraHelper, cameraEye;

  const direction = new THREE.Vector3();
  const binormal = new THREE.Vector3();
  const normal = new THREE.Vector3();
  const position = new THREE.Vector3();
  const lookAt = new THREE.Vector3();

  //Create a closed wavey loop
  const curve = new THREE.CatmullRomCurve3( [
    new THREE.Vector3( -10, 0, 10 ),
    new THREE.Vector3( -5, 5, 5 ),
    new THREE.Vector3( 0, 0, 0 ),
    new THREE.Vector3( 5, -5, 5 ),
    new THREE.Vector3( 10, 0, 10 )
  ]);

  const points = curve.getPoints( 50 );
  const geometry = new THREE.BufferGeometry().setFromPoints( points );

  const material = new THREE.LineBasicMaterial( { color : 0xff0000 } );

  // Create the final object to add to the scene
  const curveObject = new THREE.Line( geometry, material );

  return (
    <div>
      Hej där aa sgffdbfdvfbfasdasdasdasdasdsad
    </div>
  );
}


export default BasicBoxExample;