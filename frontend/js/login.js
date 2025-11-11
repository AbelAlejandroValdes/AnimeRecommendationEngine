// login.js - Manejo del formulario de login para Anime AI Recommender

document.addEventListener('DOMContentLoaded', function() {
    // Obtener el formulario
    const loginForm = document.querySelector('.login-form');
    
    // Agregar evento de envío del formulario
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Prevenir envío tradicional
        
        // Obtener datos del formulario
        const formData = new FormData(loginForm);
        const username = document.getElementById('Username').value;
        const password = document.getElementById('password').value;
        
        // Validar campos
        if (!username || !password) {
            showMessage('Por favor, completa todos los campos', 'error');
            return;
        }
        
        // Mostrar indicador de carga
        const submitButton = document.getElementById('send');
        const originalText = submitButton.value;
        submitButton.value = 'Iniciando sesión...';
        submitButton.disabled = true;
        
        // Enviar datos al servidor
        sendLoginData(formData)
            .then(response => {
                // Restaurar botón
                submitButton.value = originalText;
                submitButton.disabled = false;
                
                // Manejar respuesta
                if (response.success) {
                    showMessage('¡Inicio de sesión exitoso! Redirigiendo...', 'success');
                    // Redirigir después de un breve tiempo
                    setTimeout(() => {
                        window.location.href = response.redirect || '/dashboard';
                    }, 1500);
                } else {
                    showMessage(response.message || 'Error en el inicio de sesión', 'error');
                }
            })
            .catch(error => {
                // Restaurar botón
                submitButton.value = originalText;
                submitButton.disabled = false;
                
                // Mostrar mensaje de error
                showMessage('Error de conexión. Inténtalo de nuevo.', 'error');
                console.error('Error:', error);
            });
    });
});

// Función para enviar datos al servidor
async function sendLoginData(formData) {
    try {
        const response = await fetch('../../backend/DAO-Login.py', {
            method: 'POST',
            body: formData
        });
        
        // Verificar si la respuesta es OK
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
        // Intentar parsear como JSON
        const data = await response.json();
        return data;
        
    } catch (error) {
        // Si hay error de parseo JSON o de red
        console.error('Error en la solicitud:', error);
        throw error;
    }
}

// Función para mostrar mensajes al usuario
function showMessage(message, type) {
    // Eliminar mensajes anteriores
    const existingMessage = document.querySelector('.message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Crear elemento de mensaje
    const messageElement = document.createElement('div');
    messageElement.className = `message ${type}`;
    messageElement.textContent = message;
    
    // Estilos del mensaje
    messageElement.style.cssText = `
        padding: 12px 16px;
        margin: 15px 0;
        border-radius: 8px;
        font-weight: 500;
        text-align: center;
        transition: all 0.3s ease;
        ${type === 'success' ? 
            'background-color: rgba(76, 175, 80, 0.2); color: #4CAF50; border: 1px solid #4CAF50;' : 
            'background-color: rgba(244, 67, 54, 0.2); color: #F44336; border: 1px solid #F44336;'}
    `;
    
    // Insertar después del formulario
    const form = document.querySelector('.login-form');
    form.parentNode.insertBefore(messageElement, form.nextSibling);
    
    // Auto-eliminar después de 5 segundos (solo para mensajes de éxito)
    if (type === 'success') {
        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.parentNode.removeChild(messageElement);
            }
        }, 5000);
    }
}

// Función adicional para mejorar la experiencia de usuario
document.addEventListener('DOMContentLoaded', function() {
    // Agregar validación en tiempo real
    const inputs = document.querySelectorAll('input[type="text"], input[type="password"]');
    
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            // Limpiar mensajes de error cuando el usuario empiece a escribir
            const existingMessage = document.querySelector('.message.error');
            if (existingMessage && this.value.trim() !== '') {
                existingMessage.remove();
            }
            
            // Validación básica de longitud
            if (this.id === 'Username' && this.value.length > 0 && this.value.length < 3) {
                this.style.borderColor = '#F44336';
            } else if (this.id === 'password' && this.value.length > 0 && this.value.length < 6) {
                this.style.borderColor = '#F44336';
            } else if (this.value.length > 0) {
                this.style.borderColor = '#4CAF50';
            } else {
                this.style.borderColor = '#444';
            }
        });
        
        // Restaurar borde normal al perder el foco
        input.addEventListener('blur', function() {
            this.style.borderColor = '#444';
        });
    });
});