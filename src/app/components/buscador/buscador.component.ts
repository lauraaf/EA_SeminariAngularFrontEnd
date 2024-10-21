import { Component, OnInit } from '@angular/core';
import { BuscadorService } from '../../services/buscador.service';
import { Experiencia } from '../../models/experiencia.model';
import { UserService } from '../../services/user.service';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-search-experiencias',
  templateUrl: './buscador.component.html',
  styleUrls: ['./buscador.component.css'],
  standalone: true,
  imports: [FormsModule, HttpClientModule, CommonModule]
})
export class BuscadorComponent implements OnInit {
  searchTerm: string = '';            // Término de búsqueda
  experiencias: Experiencia[] = [];   // Lista de experiencias
  errorMessage: string = '';          // Mensaje de error
  users: User[] = [];

  constructor(
    private buscadorService: BuscadorService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.getUsers(); // Cargar usuarios al iniciar el componente
  }

  // Función para buscar experiencias por el nombre de usuario
  searchUserExperiencias(): void {
    this.errorMessage = ''; // Limpiar cualquier mensaje de error previo

    // Buscar al usuario en la lista cargada de usuarios
    const user = this.users.find((u) => u.name.toLowerCase() === this.searchTerm.toLowerCase());

    if (user) {
      // Si se encuentra el usuario, buscar sus experiencias por ID
      console.log('Usuario encontrado:', user);
      this.buscadorService.getExperienciasByOwner(user.name).subscribe({
        next: (data: Experiencia[]) => {
          console.log('Experiencias encontradas:', data);
          if (data.length > 0) {
            this.experiencias = data; // Actualizar las experiencias encontradas
          } else {
            this.experiencias = [];  // Limpiar experiencias si no hay resultados
            this.errorMessage = `No se encontraron experiencias para el usuario ${user.name}.`;
          }
        },
        error: (err) => {
          console.error('Error al obtener las experiencias:', err);
          this.experiencias = [];  // Vaciar las experiencias si hay un error
          this.errorMessage = 'Error al buscar las experiencias. Inténtalo de nuevo más tarde.';
        }
      });
    } else {
      // Si no se encuentra el usuario, mostrar mensaje de error
      this.experiencias = []; // Limpiar experiencias
      this.errorMessage = 'Usuario no encontrado';
    }
  }

  // Función para cargar la lista de usuarios
  getUsers(): void {
    this.userService.getUsers().subscribe({
      next: (data: User[]) => {
        this.users = data;
        console.log('Usuarios cargados:', this.users);
      },
      error: (error) => {
        console.error('Error al obtener los usuarios:', error);
        this.errorMessage = 'Error al cargar los usuarios.';
      }
    });
  }

  // Actualizar para manejar un array de strings
  getParticipantNames(participants: string[]): string {
    if (!participants || participants.length === 0) {
      return 'No hay participantes';
    }
    return participants.join(', ');
  }
}