import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import * as THREE from 'three';
import { GUI } from 'dat.gui'
import Stats from "three/examples/jsm/libs/stats.module";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

interface MaterialCache {
  transparentMaterial: THREE.MeshBasicMaterial
}

@Component({
  selector: 'app-my-threejs',
  template: '<div #container style="width: 100%; height: 100%;"></div>',
  styleUrls: ['./my-threejs.component.scss']
})
export class MyThreejsComponent implements OnInit, AfterViewInit{

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private gui!: GUI;
  private stats!: Stats;

  @ViewChild('container') private containerRef!: ElementRef;

  private readonly cubes: THREE.Mesh[] = [];

  private axesHelper!: THREE.AxesHelper;
  private gridHelper!: THREE.GridHelper;

  private materialCache!: MaterialCache;

  constructor(
    private el: ElementRef
  ) {
  }

  ngOnInit() {
    this.axesHelper = new THREE.AxesHelper(20);
    // 创建水平辅助线（水平网格）
    this.gridHelper = new THREE.GridHelper(20, 20);
    // 将水平辅助线旋转为水平方向
    this.gridHelper.rotation.x = Math.PI / 2;
    this.initGUI();
    this.initStats();
    this.initMaterial();
  }

  ngAfterViewInit() {
    this.initThree();

    // 创建长方体

    // this.scene.add(this.createBoxgeometry(0,0,0));
    // this.scene.add(this.createBoxgeometry(0,0,1.5))
    for (let z = .5; z < 3.5; z++) {
      for (let y = 0; y < 3; y++) {
        for (let x = 0; x < 3; x++) {
          const cube = this.createBoxGeometry(x * 1.5, y * 1.5, z * 1.5);
          this.cubes.push(cube);
          this.scene.add(cube);
        }
      }
    }

    const plane = this.createPlaneGeometry(4,4)
    plane.position.set(2,2, 0);
    this.scene.add(plane);

    this.scene.add(this.gridHelper);
    // 坐标轴
    this.scene.add(this.axesHelper);

    // 添加鼠标事件监听器
    const controls = new OrbitControls(this.camera, this.renderer.domElement);

    // 初始化旋转中心为 (0, 0, 0)
    controls.target.set(0, 0, 0);

    this.animate();
  }

  animate(): void {
    // 更新帧率统计
    this.stats.begin();

    // 在这里进行 Three.js 场景的更新操作

    // 旋转长方体
    // this.cube.rotation.x += 0.01;
    // this.cube.rotation.y += 0.01;

    // 渲染 Three.js 场景
    this.renderer.render(this.scene, this.camera);

    // 更新帧率统计
    this.stats.end();

    requestAnimationFrame(() => this.animate());
  }

  private createBoxGeometry(x: number, y: number, z: number): THREE.Mesh {
    // 创建长方体
    const geometry = new THREE.BoxGeometry(1,1,1);
    const material = this.materialCache.transparentMaterial;
    const cube = new THREE.Mesh(geometry, material);
    // 将长方体的位置设置
    cube.position.set(x, y, z);
    return cube;
  }

  private createPlaneGeometry(width: number, height: number): THREE.Mesh {
    const geometry = new THREE.PlaneGeometry(width, height);
    const material = new THREE.MeshBasicMaterial({color: 0xffff00, side: THREE.DoubleSide});
    return new THREE.Mesh( geometry, material);
  }

  private initGUI(): void {
    this.gui = new GUI();
    const displayGroup = this.gui.addFolder('Helper');
    displayGroup.open(); // 默认展开分组

    const options = {
      message: 'dat.gui',
      speed: 0.8,
      displayOutline: false,
      button: function () {},
      showAxis: true, // 增加一个布尔属性，用于控制坐标系的显示或隐藏
      showGrid: true // 新增一个布尔属性，用于控制辅助单元格显示或隐藏
    }
    this.gui.add(options, 'message')
    this.gui.add(options, 'speed', -5, 5)
    this.gui.add(options, 'displayOutline')
    this.gui.add(options, 'button')

    // 添加监听器来处理坐标系的显示或隐藏事件
    displayGroup.add(options, 'showAxis').onChange((value) => {
      if (value) {
        // 显示坐标系
        console.log('Show Axis: ON');
        // 在这里执行显示坐标系的代码
        this.scene.add(this.axesHelper);
      } else {
        // 隐藏坐标系
        console.log('Show Axis: OFF');
        // 在这里执行隐藏坐标系的代码
        this.scene.remove(this.axesHelper);
      }
    });
    displayGroup.add(options, 'showGrid').onChange((value) => {
      if (value) {
        console.log('Show Grid: ON');
        this.scene.add(this.gridHelper);
      } else {
        console.log('Show Grid: OFF');
        this.scene.remove(this.gridHelper);
      }
    })
  }

  private initStats(): void {
    this.stats = new Stats();
    this.stats.showPanel(0);
    document.body.appendChild(this.stats.dom);
  }

  private initThree(): void {
    // 创建 Three.js 场景
    this.scene = new THREE.Scene();
    // 设置背景颜色为白色
    this.scene.background = new THREE.Color(0xffffff);

    //  创建相机
    this.camera = new THREE.PerspectiveCamera(75, this.containerRef.nativeElement.clientWidth / this.containerRef.nativeElement.clientHeight, 0.1, 1000);
    this.camera.position.set(0, 0, 5);

    //  创建渲染器
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(this.containerRef.nativeElement.clientWidth, this.containerRef.nativeElement.clientHeight);

    this.el.nativeElement.appendChild(this.renderer.domElement);
  }

  private initMaterial(): void {
    this.materialCache = {} as MaterialCache;
    this.materialCache.transparentMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ff00, // 设置墙的颜色
      transparent: true, // 启用透明
      opacity: 0.5 // 设置透明度，0表示完全透明，1表示不透明
    })
  }

}
