<template>
  <div class="app">
    <!-- HEADER -->
    <header class="header">
      <div class="header-container">
        <div class="brand">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#00A859" stroke-width="2">
            <rect x="3" y="11" width="18" height="10" rx="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <div>
            <h1>PARQUEARSE</h1>
            <p>Sistema de Gestión de Flota</p>
          </div>
        </div>
        <div class="stats">
          <span>CLIENTES REGISTRADOS</span>
          <strong>{{ clientes.length }}</strong>
        </div>
      </div>
    </header>

    <!-- MAIN CONTENT -->
    <main class="main">
      
      <!-- FORMULARIO -->
      <section class="card">
        <div class="card-header">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <line x1="19" y1="8" x2="19" y2="14"></line>
            <line x1="22" y1="11" x2="16" y2="11"></line>
          </svg>
          <h2>REGISTRO DE CLIENTE</h2>
        </div>

        <div class="card-body">
          <!-- ALERTAS -->
          <div v-if="error" class="alert alert-error">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            {{ error }}
          </div>

          <div v-if="success" class="alert alert-success">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            {{ success }}
          </div>

          <!-- FORM -->
          <form @submit.prevent="guardar">
            <div class="form-row">
              <div class="field">
                <label>DOCUMENTO <span class="req">*</span></label>
                <input 
                  v-model="form.Documento" 
                  @input="form.Documento = form.Documento.replace(/\D/g, '')"
                  placeholder="Número de identificación"
                  required
                />
              </div>

              <div class="field">
                <label>TELÉFONO <span class="req">*</span></label>
                <input 
                  v-model="form.Telefono" 
                  @input="form.Telefono = form.Telefono.replace(/\D/g, '')"
                  placeholder="Número de contacto"
                  required
                />
              </div>
            </div>

            <div class="form-row">
              <div class="field">
                <label>NOMBRES <span class="req">*</span></label>
                <input 
                  v-model="form.Nombres"
                  placeholder="Nombres del cliente"
                  required
                />
              </div>

              <div class="field">
                <label>APELLIDOS <span class="req">*</span></label>
                <input 
                  v-model="form.Apellidos"
                  placeholder="Apellidos del cliente"
                  required
                />
              </div>
            </div>

            <div class="field">
              <label>CORREO ELECTRÓNICO <span class="req">*</span></label>
              <input 
                v-model="form.Email"
                type="email"
                placeholder="correo@ejemplo.com"
                required
              />
            </div>

            <div class="form-row">
              <div class="field">
                <label>PLACA VEHÍCULO 1 <span class="req">*</span></label>
                <input 
                  v-model="form.Placa1"
                  maxlength="6"
                  placeholder="ABC123"
                  class="input-placa"
                  required
                />
              </div>

              <div class="field">
                <label>PLACA VEHÍCULO 2 <span class="opt">(OPCIONAL)</span></label>
                <input 
                  v-model="form.Placa2"
                  maxlength="6"
                  placeholder="XYZ789"
                  class="input-placa"
                />
              </div>
            </div>

            <button type="submit" class="btn-submit" :disabled="loading">
              <svg v-if="!loading" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
              </svg>
              <div v-else class="spinner"></div>
              {{ loading ? 'PROCESANDO...' : 'CREAR CLIENTE' }}
            </button>
          </form>
        </div>
      </section>

      <!-- TABLA -->
      <section class="card">
        <div class="card-header">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
          <h2>BASE DE DATOS DE CLIENTES</h2>
        </div>

        <div class="card-body">
          <!-- SEARCH -->
          <div class="search-box">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
            <input 
              v-model="search"
              placeholder="Buscar por documento, nombre, apellido o placa..."
            />
          </div>

          <!-- EMPTY STATE -->
          <div v-if="clientes.length === 0" class="empty">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <line x1="19" y1="8" x2="19" y2="14"></line>
              <line x1="22" y1="11" x2="16" y2="11"></line>
            </svg>
            <h3>SIN REGISTROS</h3>
            <p>No hay clientes registrados en el sistema</p>
          </div>

          <!-- TABLE -->
          <div v-else class="table-container">
            <table>
              <thead>
                <tr>
                  <th>DOCUMENTO</th>
                  <th>NOMBRES</th>
                  <th>APELLIDOS</th>
                  <th>EMAIL</th>
                  <th>TELÉFONO</th>
                  <th>PLACA 1</th>
                  <th>PLACA 2</th>
                  <th>FECHA REGISTRO</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="c in clientes" :key="c.Documento">
                  <td><strong>{{ c.Documento }}</strong></td>
                  <td>{{ c.Nombres }}</td>
                  <td>{{ c.Apellidos }}</td>
                  <td><a :href="'mailto:' + c.Email">{{ c.Email }}</a></td>
                  <td><a :href="'tel:' + c.Telefono">{{ c.Telefono }}</a></td>
                  <td><span class="placa">{{ c.Placa1 }}</span></td>
                  <td><span v-if="c.Placa2" class="placa">{{ c.Placa2 }}</span><span v-else>—</span></td>
                  <td class="fecha">{{ c.FechaCreacion }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

    </main>

    <!-- FOOTER -->
    <footer class="footer">
      <p>© 2026 PARQUEARSE - Sistema de Gestión de Flota y Clientes</p>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import axios from 'axios'


const clientes = ref([])
const search = ref('')
const form = ref({
  Documento: '',
  Nombres: '',
  Apellidos: '',
  Email: '',
  Telefono: '',
  Placa1: '',
  Placa2: ''
})

const error = ref('')
const success = ref('')
const loading = ref(false)

const cargarClientes = async () => {
  try {
    const res = await axios.get('http://localhost:5000/clientes', {
      params: { search: search.value }
    })
    clientes.value = res.data
  } catch (e) {
    console.error('Error al cargar clientes:', e)
  }
}

const resetForm = () => {
  form.value = {
    Documento: '',
    Nombres: '',
    Apellidos: '',
    Email: '',
    Telefono: '',
    Placa1: '',
    Placa2: ''
  }
}

const guardar = async () => {
  error.value = ''
  success.value = ''
  loading.value = true

  try {
    await axios.post('https://us-central1-prueba-confy-jose.cloudfunctions.net/clientes', form.value)
    success.value = 'Cliente registrado exitosamente'
    resetForm()
    await cargarClientes()

    setTimeout(() => {
      success.value = ''
    }, 4000)
  } catch (e) {
    error.value = e.response?.data?.error || 'Error al guardar el cliente'
  } finally {
    loading.value = false
  }
}

watch(search, () => {
  cargarClientes()
})

onMounted(cargarClientes)
</script>

<style scoped>
/* RESET */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* APP BASE */
.app {
  min-height: 100vh;
  background: #121212;
  color: #FFFFFF;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
}

/* HEADER */
.header {
  background: #1E1E1E;
  border-bottom: 1px solid #2A2A2A;
  padding: 1.5rem 2rem;
}

.header-container {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.brand {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.brand h1 {
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: #FFFFFF;
  margin-bottom: 0.125rem;
}

.brand p {
  font-size: 0.75rem;
  color: #B3B3B3;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.stats {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.stats span {
  font-size: 0.625rem;
  color: #B3B3B3;
  letter-spacing: 0.1em;
  font-weight: 600;
}

.stats strong {
  font-size: 1.5rem;
  font-weight: 700;
  color: #00A859;
}

/* MAIN */
.main {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* CARD */
.card {
  background: #1E1E1E;
  border: 1px solid #2A2A2A;
  border-radius: 4px;
}

.card-header {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #2A2A2A;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.card-header svg {
  color: #00A859;
}

.card-header h2 {
  font-size: 0.875rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #FFFFFF;
}

.card-body {
  padding: 1.5rem;
}

/* ALERTS */
.alert {
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.875rem;
}

.alert-error {
  background: #3F1515;
  color: #DC2626;
  border: 1px solid #DC2626;
}

.alert-success {
  background: rgba(0, 168, 89, 0.1);
  color: #00A859;
  border: 1px solid #00A859;
}

/* FORM */
form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.field label {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: #B3B3B3;
  text-transform: uppercase;
}

.req {
  color: #DC2626;
}

.opt {
  color: #B3B3B3;
  font-weight: 400;
}

.field input {
  background: #121212;
  border: 1px solid #2A2A2A;
  border-radius: 4px;
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  color: #FFFFFF;
  transition: border-color 0.2s;
}

.field input::placeholder {
  color: #4A4A4A;
}

.field input:focus {
  outline: none;
  border-color: #00A859;
}

.input-placa {
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.1em;
  font-family: 'Courier New', monospace;
}

/* BUTTON */
.btn-submit {
  background: #00A859;
  color: #FFFFFF;
  border: none;
  border-radius: 4px;
  padding: 1rem 1.5rem;
  font-size: 0.875rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: background-color 0.2s;
  margin-top: 0.5rem;
}

.btn-submit:hover:not(:disabled) {
  background: #00C368;
}

.btn-submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* SEARCH */
.search-box {
  position: relative;
  margin-bottom: 1.5rem;
}

.search-box svg {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #B3B3B3;
}

.search-box input {
  width: 100%;
  background: #121212;
  border: 1px solid #2A2A2A;
  border-radius: 4px;
  padding: 0.75rem 1rem 0.75rem 3rem;
  font-size: 0.875rem;
  color: #FFFFFF;
  transition: border-color 0.2s;
}

.search-box input::placeholder {
  color: #4A4A4A;
}

.search-box input:focus {
  outline: none;
  border-color: #00A859;
}

/* EMPTY STATE */
.empty {
  text-align: center;
  padding: 4rem 2rem;
  color: #B3B3B3;
}

.empty svg {
  margin-bottom: 1.5rem;
  opacity: 0.3;
}

.empty h3 {
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: #FFFFFF;
  margin-bottom: 0.5rem;
}

.empty p {
  font-size: 0.875rem;
}

/* TABLE */
.table-container {
  overflow-x: auto;
  border: 1px solid #2A2A2A;
  border-radius: 4px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background: #121212;
}

th {
  padding: 1rem;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: #B3B3B3;
  border-bottom: 1px solid #2A2A2A;
}

td {
  padding: 1rem;
  font-size: 0.875rem;
  color: #FFFFFF;
  border-bottom: 1px solid #2A2A2A;
}

tbody tr:hover {
  background: #252525;
}

tbody tr:last-child td {
  border-bottom: none;
}

td a {
  color: #FFFFFF;
  text-decoration: none;
  transition: color 0.2s;
}

td a:hover {
  color: #00A859;
  text-decoration: underline;
}

.placa {
  display: inline-block;
  background: #00A859;
  color: #121212;
  padding: 0.25rem 0.625rem;
  border-radius: 2px;
  font-weight: 700;
  font-size: 0.75rem;
  letter-spacing: 0.15em;
  font-family: 'Courier New', monospace;
}

.fecha {
  font-size: 0.75rem;
  color: #B3B3B3;
}

/* FOOTER */
.footer {
  text-align: center;
  padding: 2rem;
  color: #B3B3B3;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .header-container {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .stats {
    align-items: flex-start;
  }

  .main {
    padding: 1rem;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .card-body {
    padding: 1rem;
  }

  table {
    font-size: 0.75rem;
  }

  th, td {
    padding: 0.75rem 0.5rem;
  }
}
</style>