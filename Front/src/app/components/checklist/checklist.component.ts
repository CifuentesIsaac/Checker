import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import SignaturePad from 'signature_pad';
import { LoginService } from '../../services/login.service';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { NumPartesService } from '../../services/num-partes.service';

@Component({
  selector: 'app-checklist',
  standalone: true,
  imports: [RouterLink, FormsModule, ReactiveFormsModule],
  templateUrl: './checklist.component.html',
  styleUrl: './checklist.component.css'
})
export class ChecklistComponent implements AfterViewInit, OnInit{
  @ViewChild('signaturePad') signaturePadElement!: ElementRef;

  nameUser = sessionStorage.getItem('userName');
  id_numpart = sessionStorage.getItem('id');
  SignaturePad!: SignaturePad;
  checklistForm: FormGroup;
  Date = new Date().toLocaleDateString('en-us', { day: '2-digit', month: 'short', year: 'numeric' }); //Fecha del empaque
  factura: string = ''
  // NoParte: string = ''
  // NoIssue: string = ''
  FechaEmpaque: string = ''
  Empacador: string = ''
  Bolsa: string = ''
  Sales: string = ''
  Burbuja: string = ''
  Fleje: string = ''
  Sujeciones: string = ''
  OtroSujecion: string = ''

  constructor(
    public logService: LoginService, 
    private fb: FormBuilder,
    private numPartServ: NumPartesService
  ){
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
      EtiquetaInt: [{ value: '', disabled: true }, Validators.required],
      EtiquetaExt: [{ value: '', disabled: true }, Validators.required],
      SNP: [{ value: '', disabled: true }, Validators.required],
      RevisPor: [{ value: '', disabled: true }, Validators.required],
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

  ngOnInit(): void {
    this.getInfoNumPart();
  }

  toggleInput(controlName: string, event: Event) {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.checklistForm.get(controlName)?.enable();
    } else {
      this.checklistForm.get(controlName)?.disable();
    }
  }

  getInfoNumPart() {
    this.numPartServ.getNumParteID(this.id_numpart).subscribe({
      next: (res) => {
        this.checklistForm.get('NumParte')?.setValue(res[0].NumPart)
        this.checklistForm.get('NumIssue')?.setValue(res[0].NumIssue)
      }
    })
  }

  clearSignature() {
    this.SignaturePad.clear()
  }

  generatePDF() {
    const PDF = new jsPDF();
    const pageWidth = PDF.internal.pageSize.getWidth();
    const pageHeight = PDF.internal.pageSize.getHeight();
    const margin = 10;
    const lineHeight = 7;

    // Añadir logo (sustituir con la ruta de tu logo real)
    PDF.addImage('/assets/header_logo01.png', 'PNG', margin, margin, 40, 20);
    
    // Título del reporte
    PDF.setFontSize(16);
    PDF.text('Reporte de Empaque', pageWidth / 2, 25, { align: 'center' });
    
    // Detalles del encabezado
    PDF.setFontSize(10);
    const encabezadoDetalles = [
      `No. de Factura: ${this.checklistForm.get('Factura')?.value || 'N/A'}`,
      `No. de Parte: ${this.checklistForm.get('NumParte')?.value || 'N/A'}`,
      `No. de Issue: ${String(this.checklistForm.get('NumIssue')?.value) || 'N/A'}`,
      `Fecha de Empaque: ${String(this.Date)}`,
      `Empacador: ${this.nameUser}`
    ];
    
    encabezadoDetalles.forEach((linea, index) => {
      PDF.text(linea, pageWidth - margin, 25 + (index * lineHeight), { align: 'right' });
    });

    //APARTADO DE INSUMOS
    PDF.setFontSize(12);
    PDF.text('Insumos', margin, 60);

    // Configurar tabla de insumos manualmente
    PDF.setFontSize(10);
    const startY = 65;
    const columnWidth = 80;
    const rowHeight = 10;

    // Encabezados
    PDF.text('Insumo', margin, startY);
    PDF.text('Cantidad', margin + columnWidth, startY);

    // Línea separadora
    PDF.line(margin, startY + 2, margin + columnWidth * 2, startY + 2);
    
    const datosInsumos = [
      { nombre: 'Bolsa', cantidad: String(this.checklistForm.get('Bolsa')?.value || 'N/A') },
      { nombre: 'Sales', cantidad: String(this.checklistForm.get('Sales')?.value || 'N/A') },
      { nombre: 'Burbuja', cantidad: String(this.checklistForm.get('Burbujas')?.value || 'N/A') },
      { nombre: 'Fleje', cantidad: String(this.checklistForm.get('Fleje')?.value || 'N/A') },
      { nombre: 'Sujeción', cantidad: String(this.checklistForm.get('Sujeciones')?.value || 'N/A') },
      { nombre: 'Otro', cantidad: String(this.checklistForm.get('Otro')?.value || 'N/A') }
    ];
    
    datosInsumos.forEach((insumo, index) => {
      PDF.text(insumo.nombre, margin, startY + rowHeight * (index + 1));
      PDF.text(insumo.cantidad, margin + columnWidth, startY + rowHeight * (index + 1));
    });

    //SECCION DE ETIQUETAS
    const startY2 = 180; // Ajustar según sea necesario
    
    PDF.setFontSize(12);
    PDF.text('Etiquetas', margin, startY2);

    // Configurar tabla de etiquetas manualmente
    PDF.setFontSize(10);
    const columnWidth2 = 80;
    const rowHeight2 = 10;

    // Encabezados
    PDF.text('Tipo de Etiqueta', margin, startY2 + 10);
    PDF.text('Descripción', margin + columnWidth2, startY2 + 10);

    // Línea separadora
    PDF.line(margin, startY2 + 12, margin + columnWidth2 * 2, startY2 + 12);

     // Datos de etiquetas
     const etiquetas = [
      { tipo: 'Etiqueta Externa', descripcion: this.checklistForm.get('EtiquetaExt')?.value || 'N/A' },
      { tipo: 'Etiqueta Interna', descripcion: this.checklistForm.get('EtiquetaInt')?.value || 'N/A' },
      { tipo: 'SNP', descripcion: this.checklistForm.get('SNP')?.value || 'N/A' }
    ];
    
    etiquetas.forEach((etiqueta, index) => {
      PDF.text(etiqueta.tipo, margin, startY2 + 20 + rowHeight2 * index);
      PDF.text(etiqueta.descripcion, margin + columnWidth2, startY2 + 20 + rowHeight2 * index);
    });
    
    // Sección de revisión
    PDF.text(`Revisado por: ${this.checklistForm.get('RevisPor')?.value || 'N/A'}`, margin, startY + 80);

    //FIRMA CLIENTE
    // Mover a la parte inferior de la página
    const firmaY = pageHeight - 50;
    
    // Título de sección de firma
    PDF.setFontSize(12);
    PDF.text('Firma de Conformidad', margin, firmaY);
    
    // Línea para firma
    PDF.setLineWidth(0.5);
    PDF.line(margin, firmaY + 20, pageWidth - margin, firmaY + 20);
    
    // // Texto debajo de la línea
    // PDF.setFontSize(10);
    // PDF.text('Nombre:', margin, firmaY + 30);
    // PDF.text('Fecha:', margin, firmaY + 40);
    // PDF.text('Firma:', margin, firmaY + 50);
    
    // // Espacios para llenar
    // PDF.setTextColor(150, 150, 150);
    // PDF.text('____________________________', margin + 30, firmaY + 30);
    // PDF.text('____________________________', margin + 30, firmaY + 40);
    // PDF.text('____________________________', margin + 30, firmaY + 50);
    
    // Restaurar color de texto
    PDF.setTextColor(0, 0, 0);
    

    const signatureImg = this.SignaturePad.toDataURL();

    // PDF.setFontSize(10)
    // PDF.rect(5, 5, 100, 30);
    // PDF.text('Checklist de proyecto', 10, 10);

    // PDF.text('Factura: ', 10, 20);
    // PDF.text(this.checklistForm.get('Factura')?.value || 'N/A', 40, 20);

    // PDF.text('No. De parte: ', 10, 25);
    // PDF.text(this.checklistForm.get('NumParte')?.value || 'N/A', 40, 25);

    // PDF.text('No. De Issue: ', 10, 30);
    // PDF.text(String(this.checklistForm.get('NumIssue')?.value) || 'N/A', 40, 30);


    PDF.addImage(signatureImg, 'PNG', 10, 60, 50, 20);

    const PDFUrl = PDF.output('bloburl');
    window.open(PDFUrl, '_blank');
  }
}
