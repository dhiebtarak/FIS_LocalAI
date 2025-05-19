import { Component, OnInit, OnDestroy, ElementRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as THREE from 'three';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-futuristic-cube',
  standalone: true,
  imports: [CommonModule],
  template: `<canvas #cubeCanvas></canvas>`,
  styles: [`
    canvas {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 0;
    }
  `]
})
export class FuturisticCubeComponent implements OnInit, OnDestroy {
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private cube!: THREE.Mesh;
  private animationFrameId: number | null = null;
  
  constructor(
    private elementRef: ElementRef, 
    private ngZone: NgZone,
    private themeService: ThemeService
  ) {}

  ngOnInit(): void {
    this.initScene();
    
    // Listen for theme changes to update cube color
    this.themeService.currentTheme$.subscribe(() => {
      this.updateCubeColor();
    });
    
    // Handle window resizing
    window.addEventListener('resize', this.onWindowResize.bind(this));
  }

  ngOnDestroy(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }
    
    window.removeEventListener('resize', this.onWindowResize.bind(this));
    
    // Clean up THREE.js resources
    if (this.renderer) {
      this.renderer.dispose();
    }
  }

  private initScene(): void {
    const canvas = this.elementRef.nativeElement.querySelector('canvas');
    
    // Create scene
    this.scene = new THREE.Scene();
    
    // Create camera
    this.camera = new THREE.PerspectiveCamera(
      75, 
      window.innerWidth / window.innerHeight, 
      0.1, 
      1000
    );
    this.camera.position.z = 5;
    
    // Create renderer
    this.renderer = new THREE.WebGLRenderer({ 
      canvas,
      alpha: true,
      antialias: true
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    
    // Create cube
    const geometry = new THREE.BoxGeometry(3, 3, 3);
    
    // Get cube color from CSS variables
    const cubeColor = this.getCubeColor();
    
    const material = new THREE.MeshBasicMaterial({ 
      color: cubeColor,
      wireframe: true,
      transparent: true,
      opacity: 0.2
    });
    
    this.cube = new THREE.Mesh(geometry, material);
    this.scene.add(this.cube);
    
    // Start animation loop
    this.ngZone.runOutsideAngular(() => this.animate());
  }

  private animate(): void {
    this.animationFrameId = requestAnimationFrame(() => this.animate());
    
    if (this.cube) {
      // Rotate the cube
      this.cube.rotation.x += 0.005;
      this.cube.rotation.y += 0.005;
    }
    
    this.renderer.render(this.scene, this.camera);
  }

  private onWindowResize(): void {
    if (this.camera && this.renderer) {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
  }

  private getCubeColor(): string {
    const computedStyle = getComputedStyle(document.documentElement);
    return computedStyle.getPropertyValue('--cube-color').trim() || '#4f46e5';
  }

  private updateCubeColor(): void {
    if (this.cube && this.cube.material) {
      const material = this.cube.material as THREE.MeshBasicMaterial;
      material.color.set(this.getCubeColor());
    }
  }
}