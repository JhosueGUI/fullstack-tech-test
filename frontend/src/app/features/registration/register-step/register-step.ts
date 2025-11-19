import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

// Importaciones de Servicios
import { ClientService } from '../../../services/client.service';
import { SecurityApiClient } from '../../../services/sdk/security.api-client';
import { MetadataService } from '../../../services/metadata.service';
import { UbigeoService } from '../../../services/ubigeo.service';

// Importaciones de Modelos e Interfaces
import { ClientRegisterRequest } from '../../../models/client.model';
import { UbigeoItem } from '../../../interfaces/ubigeo.interface';

// Componente para el paso de registro
@Component({
  selector: 'app-register-step',
  imports: [CommonModule, ReactiveFormsModule],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './register-step.html',
  styleUrl: './register-step.css',
  standalone: true
})
// Clase del componente RegisterStep
export class RegisterStep implements OnInit {

  @Input() selectedBonus: string | null = null;

  registrationForm!: FormGroup;
  isSubmitting = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  //datos del template
  documentTypes: string[];
  genders: string[];
  years: number[];
  months: number[] ;
  days: number[];

  departments: UbigeoItem[] = [];
  provinces: UbigeoItem[] = [];
  districts: UbigeoItem[] = [];

  //constructor con inyecciones de servicios
  constructor(
    private fb: FormBuilder,
    private clientService: ClientService,
    private securityApiClient: SecurityApiClient,
    private metadataService: MetadataService, 
    private ubigeoService: UbigeoService 
  ) {
    this.documentTypes = this.metadataService.documentTypes;
    this.genders = this.metadataService.genders;
    this.years = this.metadataService.years;
    this.months = this.metadataService.months;
    this.days = this.metadataService.days;
  }

  //método de inicialización
  ngOnInit(): void {
    this.initializeForm();
    this.fetchToken();
    this.loadUbigeoData();
    this.setupLocationListeners();
  }

  // Inicializa el formulario reactivo con validaciones
  initializeForm(): void {
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
  
      residenceDepartment: [null],
      residenceProvince: [{ value: null, disabled: true }],
      residenceDistrict: [{ value: null, disabled: true }],
      
      gender: [null, Validators.required],
    });
  }

  // Carga los datos de Ubigeo usando el servicio
  loadUbigeoData(): void {
    // Usa el servicio
    this.departments = this.ubigeoService.getDepartments();
    this.provinces = [];
    this.districts = [];
  }

  // Configura los listeners para los cambios en los selectores de ubicación
  setupLocationListeners(): void {
    this.f['residenceDepartment'].valueChanges.subscribe(departmentCode => {
      this.f['residenceProvince'].reset(null, { emitEvent: false });
      this.f['residenceDistrict'].reset(null, { emitEvent: false });
      this.f['residenceProvince'].disable();
      this.f['residenceDistrict'].disable();
      this.provinces = [];
      this.districts = [];

      if (departmentCode) {
        this.provinces = this.ubigeoService.getChildren(departmentCode, this.departments);
        if (this.provinces.length > 0) {
          this.f['residenceProvince'].enable();
        }
      }
    });

    // Escucha el cambio en la Provincia
    this.f['residenceProvince'].valueChanges.subscribe(provinceCode => {
      this.f['residenceDistrict'].reset(null, { emitEvent: false });
      this.f['residenceDistrict'].disable();
      this.districts = [];

      if (provinceCode && this.f['residenceProvince'].enabled) {
        this.districts = this.ubigeoService.getChildren(provinceCode, this.provinces);
        if (this.districts.length > 0) {
          this.f['residenceDistrict'].enable();
        }
      }
    });
  }
  // Obtiene el token de seguridad desde el servicio SDK
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

  // Getter para acceder fácilmente a los controles del formulario
  get f() {
    return this.registrationForm.controls;
  }

  // Maneja el envío del formulario
  onSubmit(): void {
    this.isSubmitting = true;
    this.successMessage = null;
    this.errorMessage = null;

    if (this.registrationForm.invalid) {
      this.isSubmitting = false;
      this.errorMessage = 'Por favor, complete correctamente todos los campos obligatorios.';
      this.registrationForm.markAllAsTouched();
      console.log('Formulario inválido. Deteniendo envío.', this.registrationForm);
      return;
    }

    const { birthYear, birthMonth, birthDay } = this.registrationForm.value;
    const birthDate = `${birthYear}-${birthMonth.toString().padStart(2, '0')}-${birthDay.toString().padStart(2, '0')}`;

    const apiData: ClientRegisterRequest = {
        token: this.f['token'].value,
        document_type: this.f['document_type'].value,
        document_number: this.f['document_number'].value,
        names: this.f['names'].value,
        last_names: this.f['last_names'].value,
        birth_date: birthDate,
        phone_number: this.f['phone_number'].value,
    };

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

  // Método para verificar si un control del formulario tiene errores y ha sido tocado
  showError(controlName: string): boolean {
    const control = this.registrationForm.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}