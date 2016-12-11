import { Component, OnInit, OnDestroy } from '@angular/core';
import { Angular2Apollo } from 'angular2-apollo';
import { Subscription } from 'rxjs/Subscription';

import gql from 'graphql-tag';

import 'rxjs/add/operator/toPromise';

const TrainerQuery = gql`
  query TrainerQuery {
    Trainer(name: "__NAME__") {
      id
      name
      ownedPokemons {
        name
        url
      }
    }
  }
`;

@Component({
  selector: 'feed',
  template: `
    <div class="w-100" style="max-width: 400px">
      <div *ngIf="loading">
        Loading
      </div>
      <div *ngIf="!loading">
        <div>
          Hey {{Trainer.name}}, you have {{ownedPokemons.length}} pokemons in your pokedex
        </div>
        <div class="pa3 bg-black-05 ma3" *ngFor="let pokemon of ownedPokemons">
          <div class="dim grow">
            <img src="{{pokemon.url}}" style="width:100%">
          </div>
          <div class="pt3">
            {{pokemon.name}}
          </div>
        </div>
      </div>
    </div>
  `,
  host: {'style': 'width: 100%; display: flex; justify-content: center;'}
})

export class PokedexComponent implements OnInit, OnDestroy {

  loading: boolean = true;
  Trainer: any;
  TrainerSub: Subscription;
  ownedPokemons: any;

  constructor(
    private apollo: Angular2Apollo
  ) {}

  setImage(url: string) {
    const styles = {
      'background-image':  `url(${url})`,
      'background-size': 'cover',
      'padding-bottom': '100%',
    };
    return styles;
  }

  ngOnInit() {
    this.TrainerSub = this.apollo.watchQuery({
      query: TrainerQuery
    }).subscribe(({data, loading}) => {
      this.Trainer = data.Trainer;
      this.ownedPokemons = this.Trainer.ownedPokemons
      this.loading = loading;
    });
  }

  ngOnDestroy() {
    this.TrainerSub.unsubscribe();
  }
}
