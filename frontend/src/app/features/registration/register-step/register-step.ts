// frontend/src/app/features/registration/register-step/register-step.ts

import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

import { ClientService } from '../../../services/client.service';
import { ClientRegisterRequest } from '../../../models/client.model';
import { SecurityApiClient } from '../../../services/sdk/security.api-client';

// 🚨 RUTA DE UBIGEO DEL USUARIO
import { UBIGEO_PERU, UbigeoItem } from '../../../data/ubigeo.data'; 


@Component({
  selector: 'app-register-step',
  imports: [CommonModule, ReactiveFormsModule],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './register-step.html',
  styleUrl: './register-step.css',
  standalone: true
})
export class RegisterStep implements OnInit {

  @Input() selectedBonus: string | null = null;

  registrationForm!: FormGroup;
  isSubmitting = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  // Variables para listas desplegables (existentes)
  documentTypes = ['DNI', 'Carnet de extranjería'];
  genders = ['Masculino', 'Femenino', 'Otro'];
  years: number[] = Array.from({length: 100}, (_, i) => new Date().getFullYear() - 18 - i);
  months: number[] = Array.from({length: 12}, (_, i) => i + 1);
  days: number[] = Array.from({length: 31}, (_, i) => i + 1);

  // Variables para listas de Ubigeo
  departments: UbigeoItem[] = [];
  provinces: UbigeoItem[] = [];
  districts: UbigeoItem[] = [];

  constructor(
    private fb: FormBuilder,
    private clientService: ClientService,
    private securityApiClient: SecurityApiClient
  ) {}

  ngOnInit(): void {
    // 1. Inicializar formulario
    this.registrationForm = this.fb.group({
      token: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(8)]],
      document_type: ['DNI', Validators.required],
      document_number: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(12)]],
      names: ['', [Validators.required, Validators.maxLength(100)]],
      last_names: ['', [Validators.required, Validators.maxLength(100)]],
      birthYear: [null, Validators.required],
      birthMonth: [null, Validators.required],
      birthDay: [null, Validators.required],
      phone_number: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(20)]],
      
      // 🚨 CORRECCIÓN CLAVE: Quitamos Validators.required de los 3 campos de Ubigeo
      residenceDepartment: [null],
      residenceProvince: [{ value: null, disabled: true }],
      residenceDistrict: [{ value: null, disabled: true }],
      
      gender: [null, Validators.required],
    });

    // 2. Obtener el token
    this.fetchToken();

    // 3. Cargar datos de Ubigeo y configurar escuchas
    this.loadUbigeoData();
    this.setupLocationListeners();
  }

  loadUbigeoData(): void {
    this.departments = UBIGEO_PERU;
    this.provinces = [];
    this.districts = [];
  }

  // Configuración de la lógica anidada para Ubigeo (manejo de enable/disable para UX)
  setupLocationListeners(): void {
    
    // Escucha el cambio en el Departamento
    this.f['residenceDepartment'].valueChanges.subscribe(departmentCode => {
      // 1. Resetear y deshabilitar niveles inferiores (reseteo silencioso)
      this.f['residenceProvince'].reset(null, { emitEvent: false });
      this.f['residenceDistrict'].reset(null, { emitEvent: false });
      this.f['residenceProvince'].disable();
      this.f['residenceDistrict'].disable();
      this.provinces = [];
      this.districts = [];

      if (departmentCode) {
        // 2. Encontrar el departamento y cargar provincias (children)
        const department = this.departments.find(d => d.code === departmentCode);
        this.provinces = department?.children || [];

        // Habilita la Provincia si hay provincias disponibles
        if (this.provinces.length > 0) {
          this.f['residenceProvince'].enable();
        }
      }
    });

    // Escucha el cambio en la Provincia
    this.f['residenceProvince'].valueChanges.subscribe(provinceCode => {
      // 1. Resetear y deshabilitar nivel inferior (reseteo silencioso)
      this.f['residenceDistrict'].reset(null, { emitEvent: false });
      this.f['residenceDistrict'].disable();
      this.districts = [];

      // Solo proceder si la provincia está seleccionada Y el control NO está deshabilitado
      if (provinceCode && this.f['residenceProvince'].enabled) {
        // 2. Encontrar la provincia y cargar distritos (children)
        const province = this.provinces.find(p => p.code === provinceCode);
        this.districts = province?.children || [];
        
        // Habilita el Distrito si hay distritos disponibles
        if (this.districts.length > 0) {
          this.f['residenceDistrict'].enable();
        }
      }
    });
  }

  fetchToken(): void {
    if (this.selectedBonus) {
        this.f['token'].setValue(this.selectedBonus);
        return;
    }

    this.securityApiClient.generateToken().subscribe({
        next: (response) => {
            const tokenGenerado = response.data.token;
            this.f['token'].setValue(tokenGenerado);
        },
        error: (error) => {
            console.error('Error al obtener el token de seguridad:', error);
            this.errorMessage = 'No se pudo obtener el token de seguridad. Intente recargar.';
        }
    });
  }

  get f() {
    return this.registrationForm.controls;
  }

  onSubmit(): void {
    this.isSubmitting = true;
    this.successMessage = null;
    this.errorMessage = null;

    // 🚨 Diagnóstico: El formulario debe ser válido para continuar
    if (this.registrationForm.invalid) {
      this.isSubmitting = false;
      this.errorMessage = 'Por favor, complete correctamente todos los campos obligatorios.';
      this.registrationForm.markAllAsTouched();
      console.log('Formulario inválido. Deteniendo envío.', this.registrationForm);
      return;
    }

    const { birthYear, birthMonth, birthDay } = this.registrationForm.value;
    const birthDate = `${birthYear}-${birthMonth.toString().padStart(2, '0')}-${birthDay.toString().padStart(2, '0')}`;

    // MAPEO DE LOS DATOS AL MODELO DE LA API (Solo los 7 campos requeridos)
    const apiData: ClientRegisterRequest = {
        token: this.f['token'].value,
        document_type: this.f['document_type'].value,
        document_number: this.f['document_number'].value,
        names: this.f['names'].value,
        last_names: this.f['last_names'].value,
        birth_date: birthDate,
        phone_number: this.f['phone_number'].value,
    };

    // 🚨 console.log para verificar los datos enviados
    console.log('Datos enviados a la API de registro:', apiData);

    this.clientService.attemptRegistration(apiData).subscribe({
      next: (response) => {
        this.successMessage = `¡Registro exitoso! ID: ${response.clientId}. ${response.message}`;
        this.registrationForm.reset({ document_type: 'DNI' });
        this.fetchToken();
      },
      error: (error: HttpErrorResponse) => {
        this.isSubmitting = false;
        if (error.status === 400) {
            this.errorMessage = 'Datos de entrada inválidos. Revise los campos.';
        } else if (error.status === 401) {
          this.errorMessage = 'Token de seguridad inválido o expirado.';
        } else if (error.status === 409) {
          this.errorMessage = 'El número de documento ya está registrado.';
        } else {
          this.errorMessage = error.error?.message || 'Error desconocido del servidor.';
        }
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
  }

  showError(controlName: string): boolean {
    const control = this.registrationForm.get(controlName);
    // Solo muestra error si el campo es inválido Y ha sido tocado/modificado
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}