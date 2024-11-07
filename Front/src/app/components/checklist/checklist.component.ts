import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import SignaturePad from 'signature_pad';
import { LoginService } from '../../services/login.service';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-checklist',
  standalone: true,
  imports: [RouterLink, FormsModule, ReactiveFormsModule],
  templateUrl: './checklist.component.html',
  styleUrl: './checklist.component.css'
})
export class ChecklistComponent implements AfterViewInit{
  @ViewChild('signaturePad') signaturePadElement!: ElementRef;

  nameUser = sessionStorage.getItem('userName');
  SignaturePad!: SignaturePad;
  checklistForm: FormGroup;
  Date = new Date().toLocaleDateString('en-us', { day: '2-digit', month: 'short', year: 'numeric' }); //Fecha del empaque
  factura: string = ''
  NoParte: string = ''
  NoIssue: string = ''
  FechaEmpaque: string = ''
  Empacador: string = ''
  Bolsa: string = ''
  Sales: string = ''
  Burbuja: string = ''
  Fleje: string = ''
  Sujeciones: string = ''
  OtroSujecion: string = ''

  constructor(public logService: LoginService, private fb: FormBuilder){
    this.checklistForm = this.fb.group({
      Factura: [{ value: '', disabled: true }, Validators.required],
      NumParte: [{ value: '', disabled: true }, Validators.required],
      NumIssue: [{ value: '', disabled: true }, Validators.required],
      Bolsa: [{ value: '', disabled: true }, Validators.required],
      Sales: [{ value: '', disabled: true }, Validators.required],
      Burbujas: [{ value: '', disabled: true }, Validators.required],
      Fleje: [{ value: '', disabled: true }, Validators.required],
      Sujeciones: [{ value: '', disabled: true }, Validators.required],
      Otro: [{ value: '', disabled: true }, Validators.required],
    })
  }
  
  ngAfterViewInit(): void {
    this.SignaturePad = new SignaturePad(this.signaturePadElement.nativeElement);
    // const viewportWidth = window.outerWidth;
    // const viewportHeight = window.outerHeight;
    // const canvasWidth = viewportWidth;
    // const canvasHeight = viewportHeight;
    // this.signaturePadElement.nativeElement.height = canvasHeight;
    // this.signaturePadElement.nativeElement.width = canvasWidth;
    window.addEventListener('resize', this.ngAfterViewInit)
  }

  toggleInput(controlName: string, event: Event) {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.checklistForm.get(controlName)?.enable();
    } else {
      this.checklistForm.get(controlName)?.disable();
    }
  }

  clearSignature() {
    this.SignaturePad.clear()
  }

  generatePDF() {
    const PDF = new jsPDF();

    const signatureImg = this.SignaturePad.toDataURL();

    PDF.setFontSize(10)
    PDF.rect(5, 5, 100, 30);
    PDF.text('Checklist de proyecto', 10, 10);

    PDF.text('Factura: ', 10, 20);
    PDF.text(this.checklistForm.get('Factura')?.value || 'N/A', 40, 20);

    PDF.text('No. De parte: ', 10, 25);
    PDF.text(this.checklistForm.get('NumParte')?.value || 'N/A', 40, 25);

    PDF.text('No. De Issue: ', 10, 30);
    PDF.text(this.checklistForm.get('NumIssue')?.value || 'N/A', 40, 30);

    PDF.addImage(signatureImg, 'PNG', 10, 60, 50, 20);

    const PDFUrl = PDF.output('bloburl');
    window.open(PDFUrl, '_blank');
  }
}
