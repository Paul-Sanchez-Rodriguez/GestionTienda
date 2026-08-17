import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ClientService } from '../../services/client.service';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [RouterLink, CurrencyPipe, DatePipe],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.scss',
})
export class ClientsComponent {
  private readonly clientService = inject(ClientService);

  readonly searchQuery = signal('');
  readonly showForm = signal(false);
  readonly formName = signal('');
  readonly formLastname = signal('');
  readonly formPhone = signal('');

  get clients() {
    return this.clientService.searchClients(this.searchQuery());
  }

  get totalDebt() {
    return this.clients.reduce((sum, client) => sum + client.debt, 0);
  }

  onSearchInput(event: Event): void {
    this.searchQuery.set((event.target as HTMLInputElement).value);
  }

  clearSearch(): void {
    this.searchQuery.set('');
  }

  toggleForm(): void {
    this.showForm.update((value) => !value);
  }

  onFormInput(field: 'name' | 'lastname' | 'phone', event: Event): void {
    const value = (event.target as HTMLInputElement).value;

    switch (field) {
      case 'name':
        this.formName.set(value);
        break;
      case 'lastname':
        this.formLastname.set(value);
        break;
      case 'phone':
        this.formPhone.set(value);
        break;
    }
  }

  createClient(event: Event): void {
    event.preventDefault();

    if (!this.formName().trim() || !this.formLastname().trim()) {
      return;
    }

    this.clientService.createClient(
      this.formName(),
      this.formLastname(),
      this.formPhone()
    );

    this.formName.set('');
    this.formLastname.set('');
    this.formPhone.set('');
    this.showForm.set(false);
  }
}
