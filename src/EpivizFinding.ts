import { html, css, LitElement, property } from 'lit-element';
import {finding} from './model';

import '@kor-ui/kor';

export class EpivizFinding extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 25px;
      color: var(--epiviz-finding-text-color, #000);
    }

    .form-elem {
      margin: 3px;
    }

    .show-fds {
      background-color:  #4285f4;
      --text-1:  #fafafa;
    }

    .show-fds:hover {
      background-color: grey;
    }
  `;

  @property({type: String}) wsApi = "http://localhost:8001/api/v1";
  @property({type: Array, attribute: false}) findings: finding[] = [];
  @property({type: Number}) wid;
  @property({type: String}) new_title;
  @property({type: String}) new_desc;
  @property({type: String}) user;
  @property({type: String}) userToken;

  constructor() {
    super();
  }

  _fetchFindings() {
    fetch(this.wsApi + "/" + this.wid + "/findings")
    .then(response => response.json())
    .then(data => {
      this.findings = data;
    });
  }

  attributeChangedCallback(name, oldval, newval) {
    super.attributeChangedCallback(name, oldval, newval);
    console.log(name);
    if (name == "wid") {
      this._fetchFindings();
    }
  }

  _showFinding(fds: Object) {
    let event = new CustomEvent('show-finding', {
      detail: {
        finding: fds
      }
    });
    this.dispatchEvent(event);
  }

  _addFinding() {
    // access genomic region
    let new_finding = {
      "user_id": "kancherj",
      "title": this.new_title,
      "description": this.new_desc,
      "gene": this.getUrlParameter("gene"),
      "genes_in_view": [this.getUrlParameter("gene")],
      "workspace_id": this.wid,
      "chrm": "chr2",
      "start": 1000000,
      "end": 2000000
    }

    console.log(new_finding);
    fetch(this.wsApi + "/findings/", {
      method: 'post',
      body: JSON.stringify(new_finding)
    })
    .then(response => response.json())
    .then(data => {
      this._fetchFindings();
    });

  }

  getUrlParameter(sParam) {
    var currPage = decodeURIComponent(window.location.search.substring(1));
    var pageVars = currPage.split('&');

    for (var i = 0; i < pageVars.length; i++) {
        var pageParamName = pageVars[i].split('=');

        if (pageParamName[0] === sParam) {
            return pageParamName[1] === undefined ? true : pageParamName[1];
        }
    }
  }

  render() {
    return html`
      <kor-page flat flex-direction="column">
        <kor-app-bar
          label="Findings">
          <kor-button 
            slot="functions"
            label="Save a new finding" 
            color="Primary"
            @click=${this._addFinding}>
          </kor-button>
        </kor-app-bar>
          <kor-card>
            <kor-modal 
            label="New Finding" 
            icon="lightbulb" 
            height="75%" 
            width="75%" 
            flex-direction="Column">
          </kor-modal>
          <kor-accordion 
            label="Save a new Finding" 
            icon="add">
            <kor-input 
              class="form-elem"
              label="Finding (short title)" 
              @change=${e => {this.new_title = e.target.value}}
              type="text">
            </kor-input>
            <kor-textarea 
              class="form-elem"
              label="Description"               
              @change=${e => {this.new_desc = e.target.value}}
              rows="3">
            </kor-textarea>
            <kor-button 
              class="form-elem show-fds"
              style="float:right;"
              label="Save" 
              color="Primary"
              @click=${this._addFinding}>
            </kor-button>
          </kor-accordion>
          <kor-divider 
            spacing="s" 
            orientation="horizontal">
          </kor-divider>
          <kor-input 
            label="Search Findings" 
            value="" 
            icon="search" 
            type="text">
          </kor-input>
          ${this.findings.map(item => 
            html`
            <kor-card icon="bookmark" label=${item.title}>
              <kor-tag slot="functions" label=${item.gene}></kor-tag>
              <kor-tag 
                class="show-fds" 
                slot="functions" 
                label="Open Finding" 
                icon="add" 
                button="true"
                @click=${() => this._showFinding(item)}></kor-tag>
              <kor-divider 
                spacing="s" 
                orientation="horizontal">
              </kor-divider>
              ${item.description}
              <!-- <kor-button label="Open Finding" slot="footer"></kor-button> -->
            </kor-card>
          `)}
        </kor-card>
      </kor-page>
    `;
  }
}
