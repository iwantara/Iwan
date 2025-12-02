// Setup PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

// Global variables
let pdfDoc = null;
let pdfBytes = null;
let pdfData = null;
let pageTexts = {}; // Store edited text for each page

// DOM elements
const uploadBtn = document.getElementById('uploadBtn');
const pdfUpload = document.getElementById('pdfUpload');
const fileName = document.getElementById('fileName');
const pdfContainer = document.getElementById('pdfContainer');
const controls = document.getElementById('controls');
const downloadBtn = document.getElementById('downloadBtn');
const pageInfo = document.getElementById('pageInfo');
const loadingIndicator = document.getElementById('loadingIndicator');

// Event listeners
uploadBtn.addEventListener('click', () => pdfUpload.click());
pdfUpload.addEventListener('change', handleFileUpload);
downloadBtn.addEventListener('click', downloadEditedPDF);

// Handle file upload
async function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file || file.type !== 'application/pdf') {
        alert('Silakan pilih file PDF yang valid!');
        return;
    }

    showLoading(true);
    fileName.textContent = file.name;

    try {
        // Read file as ArrayBuffer
        const arrayBuffer = await file.arrayBuffer();
        pdfBytes = new Uint8Array(arrayBuffer);

        // Load PDF with pdf.js
        const loadingTask = pdfjsLib.getDocument({ data: pdfBytes });
        pdfDoc = await loadingTask.promise;

        // Display all pages
        await displayAllPages();

        controls.style.display = 'flex';
        pageInfo.textContent = `Total: ${pdfDoc.numPages} halaman`;

    } catch (error) {
        console.error('Error loading PDF:', error);
        alert('Gagal memuat PDF. Silakan coba lagi.');
    } finally {
        showLoading(false);
    }
}

// Display all PDF pages
async function displayAllPages() {
    pdfContainer.innerHTML = '';
    pageTexts = {}; // Reset page texts

    for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
        await renderPage(pageNum);
    }
}

// Render a single page
async function renderPage(pageNum) {
    const page = await pdfDoc.getPage(pageNum);

    // Create page wrapper
    const pageWrapper = document.createElement('div');
    pageWrapper.className = 'page-wrapper';
    pageWrapper.id = `page-${pageNum}`;

    // Create page header
    const pageHeader = document.createElement('div');
    pageHeader.className = 'page-header';
    pageHeader.innerHTML = `
        <span class="page-number">Halaman ${pageNum}</span>
        <button class="edit-mode-toggle" data-page="${pageNum}">✏️ Edit Teks</button>
    `;

    // Create canvas container
    const canvasContainer = document.createElement('div');
    canvasContainer.className = 'canvas-container';

    // Create canvas
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    // Set scale for better quality
    const viewport = page.getViewport({ scale: 1.5 });
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    // Render PDF page
    await page.render({
        canvasContext: context,
        viewport: viewport
    }).promise;

    // Create text overlay container
    const textOverlay = document.createElement('div');
    textOverlay.className = 'text-overlay';
    textOverlay.id = `overlay-${pageNum}`;
    textOverlay.style.display = 'none';

    // Get text content
    const textContent = await page.getTextContent();
    pageTexts[pageNum] = extractPageText(textContent);

    // Append elements
    canvasContainer.appendChild(canvas);
    canvasContainer.appendChild(textOverlay);
    pageWrapper.appendChild(pageHeader);
    pageWrapper.appendChild(canvasContainer);
    pdfContainer.appendChild(pageWrapper);

    // Add edit button listener
    const editBtn = pageHeader.querySelector('.edit-mode-toggle');
    editBtn.addEventListener('click', () => toggleEditMode(pageNum));
}

// Extract text from page
function extractPageText(textContent) {
    return textContent.items.map(item => item.str).join(' ');
}

// Toggle edit mode for a page
function toggleEditMode(pageNum) {
    const editBtn = document.querySelector(`[data-page="${pageNum}"]`);
    const overlay = document.getElementById(`overlay-${pageNum}`);

    if (overlay.style.display === 'none') {
        // Enter edit mode
        overlay.style.display = 'block';
        editBtn.classList.add('active');
        editBtn.innerHTML = '💾 Simpan';

        // Create editable text area if not exists
        if (overlay.children.length === 0) {
            createEditableTextArea(pageNum, overlay);
        }
    } else {
        // Exit edit mode
        overlay.style.display = 'none';
        editBtn.classList.remove('active');
        editBtn.innerHTML = '✏️ Edit Teks';

        // Save text changes
        const textarea = overlay.querySelector('textarea');
        if (textarea) {
            pageTexts[pageNum] = textarea.value;
        }
    }
}

// Create editable text area
function createEditableTextArea(pageNum, overlay) {
    const textLayer = document.createElement('div');
    textLayer.className = 'text-layer';
    textLayer.style.top = '20px';
    textLayer.style.left = '20px';
    textLayer.style.width = 'calc(100% - 40px)';

    const textarea = document.createElement('textarea');
    textarea.value = pageTexts[pageNum] || '';
    textarea.placeholder = 'Ketik atau edit teks di sini...';
    textarea.rows = 20;

    // Auto-resize textarea
    textarea.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = this.scrollHeight + 'px';
    });

    textLayer.appendChild(textarea);
    overlay.appendChild(textLayer);

    // Focus on textarea
    setTimeout(() => textarea.focus(), 100);
}

// Download edited PDF
async function downloadEditedPDF() {
    if (!pdfBytes) {
        alert('Tidak ada PDF yang dimuat!');
        return;
    }

    showLoading(true);

    try {
        // Load PDF with pdf-lib
        const pdfLibDoc = await PDFLib.PDFDocument.load(pdfBytes);
        const pages = pdfLibDoc.getPages();

        // Get font
        const font = await pdfLibDoc.embedFont(PDFLib.StandardFonts.Helvetica);

        // Update each page with edited text
        for (let i = 0; i < pages.length; i++) {
            const pageNum = i + 1;
            const page = pages[i];

            // Check if page has edited text
            const overlay = document.getElementById(`overlay-${pageNum}`);
            if (overlay && overlay.style.display === 'block') {
                const textarea = overlay.querySelector('textarea');
                if (textarea && textarea.value.trim()) {
                    // Get page dimensions
                    const { height } = page.getSize();

                    // Draw text on page
                    const text = textarea.value;
                    const fontSize = 12;
                    const lineHeight = fontSize + 4;
                    const maxWidth = page.getWidth() - 100;

                    // Split text into lines
                    const lines = wrapText(text, font, fontSize, maxWidth);

                    // Draw each line
                    let y = height - 60; // Start from top with margin

                    for (const line of lines) {
                        if (y < 50) break; // Stop if reaching bottom

                        page.drawText(line, {
                            x: 50,
                            y: y,
                            size: fontSize,
                            font: font,
                            color: PDFLib.rgb(0, 0, 0)
                        });

                        y -= lineHeight;
                    }
                }
            }
        }

        // Save PDF
        const modifiedPdfBytes = await pdfLibDoc.save();

        // Download
        const blob = new Blob([modifiedPdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'edited_' + (fileName.textContent || 'document.pdf');
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        alert('PDF berhasil didownload!');

    } catch (error) {
        console.error('Error saving PDF:', error);
        alert('Gagal menyimpan PDF. Silakan coba lagi.');
    } finally {
        showLoading(false);
    }
}

// Wrap text to fit width
function wrapText(text, font, fontSize, maxWidth) {
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';

    for (const word of words) {
        const testLine = currentLine + (currentLine ? ' ' : '') + word;
        const width = font.widthOfTextAtSize(testLine, fontSize);

        if (width > maxWidth && currentLine) {
            lines.push(currentLine);
            currentLine = word;
        } else {
            currentLine = testLine;
        }
    }

    if (currentLine) {
        lines.push(currentLine);
    }

    return lines;
}

// Show/hide loading indicator
function showLoading(show) {
    loadingIndicator.style.display = show ? 'block' : 'none';
}
