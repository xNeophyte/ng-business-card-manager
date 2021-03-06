import { Component, OnInit } from '@angular/core';
import { ContactsService } from 'src/app/core/contacts.service';
import { Contact } from 'src/app/shared/models/contact';
import * as _ from 'lodash';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { HistoryService } from 'src/app/core/history.service';
import { Action } from 'src/app/shared/models/history-log';
import { untilComponentDestroyed } from 'ng2-rx-componentdestroyed';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css']
})
export class ContactListComponent implements OnInit {
  contacts: Contact[];
  filteredContacts: Contact[];
  searchInput = new FormControl();
  searchString: string;

  constructor(private contactService: ContactsService,
              private historyService: HistoryService
              ) {
    this.searchString = '';
    this.contacts = [];
    this.filteredContacts = [];
  }

  ngOnInit() {
    this.contactService.getUserContactsSnapshots()
      .pipe(
        untilComponentDestroyed(this) // <--- magic is here!
      )
      .subscribe( contacts => {
        this.contacts = contacts;
        console.log(this.contacts);
        this.applyFilters();
    });

    this.searchInput.valueChanges
      .pipe(
        debounceTime(1000),
        untilComponentDestroyed(this) // <--- magic is here!
        )
      .subscribe( (newValue: string) => {
        this.searchString = newValue.toLowerCase();
        this.applyFilters();
      });

  }

  private applyFilters() {
    if (this.searchString) {
      this.historyService.log(Action.Searched, this.searchString);
      this.filteredContacts = _.filter(this.contacts, (contact: Contact) => {
        // tslint:disable-next-line:max-line-length
        return `${contact.businessCard.firstName} ${contact.businessCard.lastName} ${contact.businessCard.email}`
          .toLocaleLowerCase()
          .includes(this.searchString);
     });
    } else {
      this.filteredContacts = this.contacts;
    }
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnDestroy() {
  }
}
