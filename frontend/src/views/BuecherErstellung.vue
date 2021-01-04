<template>
  <v-container class="my-5">
    <v-form ref="form">
      <h3 class="grey--text mb-5">Bücher Erstellung</h3>
      <v-container class="my-5 mx-5">
        <div v-if="!auswahl">
          <v-btn text @click="Umschalten"
            ><v-icon>mdi-keyboard-return</v-icon>zurück</v-btn
          >
        </div>
      </v-container>
      <div>
        <v-snackbar
          v-model="snackbarErf"
          multi-line="true"
          color="primary"
          timeout="5000"
        >
          {{ msg }}
          <template>
            <v-btn color="white" text @click="snackbarErf = false" class="ml4">
              <v-icon right>mdi-window-close</v-icon>
            </v-btn>
          </template>
        </v-snackbar>
      </div>
      <div>
        <v-snackbar
          v-model="snackbarErr"
          multi-line="true"
          color="error"
          timeout="5000"
        >
          {{ msg }}
          <template>
            <v-btn color="white" text @click="snackbarErr = false" class="ml4">
              <v-icon right>mdi-window-close</v-icon>
            </v-btn>
          </template>
        </v-snackbar>
      </div>

      <v-dialog v-model="dialog" max-width="460">
        <v-card>
          <v-card-title
            >Sind Sie sicher das {{ buchid.name }} aus der Klasse
            {{ buchid.klasse }} das Buch mit der Buchnr
            {{ buchid.buchnr }} zurückgegeben hat?</v-card-title
          >

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn color="red darken-1" text @click="dialog = false"
              >abbrechen</v-btn
            >

            <v-btn color="green darken-1" text @click="BuchZurueckgegeben()"
              >Bestätingen</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>

      <div v-if="auswahl">
        <v-container class="my-5 mx-5">
          <v-btn block @click="buchHinzu = true">Buch hinzufügen</v-btn>
        </v-container>
        <v-container class="my-5 mx-5">
          <v-btn block @click="verleih = true">Verleihung eintragen</v-btn>
        </v-container>
        <v-container class="my-5 mx-5">
          <v-btn block @click="sehen = true">Verleihungen sehen</v-btn>
        </v-container>
        <v-container class="my-5 mx-5">
          <v-btn block @click="buchinfo = true">Buch infos</v-btn>
        </v-container>
      </div>
      <div v-if="buchHinzu">
        <v-container class="my-5 mx-5">
          <v-combobox v-model="buchnr" label="Buch Nr." :rules="Rules">
          </v-combobox>

          <v-combobox
            v-model="select"
            :items="items"
            label="ISBN"
            item-text="isbn"
            :rules="Rules"
            return-object
          >
          </v-combobox>

          <v-combobox v-model="title" label="Title" :rules="Rules">
          </v-combobox>

          <v-combobox v-model="autor" label="Autor" :rules="Rules">
          </v-combobox>

          <v-combobox v-model="jahr" label="Jahr" :rules="Rules"> </v-combobox>

          <v-combobox v-model="verlag" label="Verlag" :rules="Rules">
          </v-combobox>
          <div class="text-center my-5 mx-5">
            <v-btn text @click="buchHinzufuegen()">Hinzufügen</v-btn>
          </div>
        </v-container>
      </div>
      <div v-if="verleih">
        <v-autocomplete
          v-model="klasse"
          :items="klassenliste"
          label="Klasse"
          item-text="klasse"
          :rules="Rules"
          return-object
        >
        </v-autocomplete>

        <v-autocomplete
          v-model="schueler"
          :items="schuelerliste"
          label="Schüler"
          item-text="nachname"
          :rules="Rules"
          return-object
        >
        </v-autocomplete>

        <v-autocomplete
          v-model="select"
          :items="items"
          label="ISBN"
          item-text="isbn"
          :rules="Rules"
          return-object
        >
        </v-autocomplete>

        <v-autocomplete
          v-model="buch"
          :items="buecher"
          label="Buch"
          item-text="buchnr"
          :rules="Rules"
          return-object
        >
        </v-autocomplete>
        <div class="text-center my-5 mx-5">
          <v-btn text @click="verleihungHinzufuegen()">Hinzufügen</v-btn>
        </div>
      </div>
      <div v-if="sehen">
        <v-autocomplete
          v-model="klasse"
          :items="klassenliste"
          label="Klasse"
          item-text="klasse"
          :rules="Rules"
          return-object
        >
        </v-autocomplete>
        <v-autocomplete
          v-model="schueler"
          :items="schuelerliste"
          label="Schüler"
          item-text="nachname"
          :rules="Rules"
          return-object
        >
        </v-autocomplete>
        <div v-if="vergebeneBuecher.length">
          <v-card
            flat
            v-for="buch in vergebeneBuecher"
            :key="buch.ausleihbuchid"
          >
            <v-layout row wrap :class="`pa-3 status ${buch.zurueckgegeben}`">
              <v-flex xs2 sm2 md2 lg2 xl2>
                <div class="caption grey--text mb-1 mx-4">Name</div>
                <div class="mx-4">{{ buch.name }}</div>
              </v-flex>
              <v-flex xs2 sm2 md2 lg2 xl2>
                <div class="caption grey--text mb-1 mx-4">Klasse</div>
                <div class="mx-4">{{ buch.klasse }}</div>
              </v-flex>
              <v-flex xs2 sm2 md2 lg2 xl2>
                <div class="caption grey--text mb-1 mx-4">ISBN</div>
                <div class="mx-4">{{ buch.isbn }}</div>
              </v-flex>
              <v-flex xs2 sm2 md2 lg2 xl2>
                <div class="caption grey--text mb-1 mx-4">Buchnr</div>
                <div class="mx-4">{{ buch.buchnr }}</div>
              </v-flex>
              <v-flex xs3 sm3 md3 lg3 xl3>
                <div class="caption grey--text mb-1 mx-4">Ausgeliehen am</div>
                <div class="mx-4">{{ buch.datum }}</div>
              </v-flex>
              <v-flex xs1 sm1 md1 lg1 xl1>
                <div class="caption grey--text">Buchabgabe</div>
                <div class="mx-4">
                  <div v-if="buch.zurueckgegeben == null">
                    <v-tooltip top>
                      <template v-slot:activator="{ on }">
                        <v-btn
                          text
                          v-on="on"
                          @click="buchid = buch"
                          @click.stop="dialog = true"
                        >
                          <v-icon>mdi-book</v-icon>
                        </v-btn>
                      </template>
                      <span
                        >Jetzt den Button anklicken um einzutragen das, dass
                        Buch zurückgegeben wurde</span
                      >
                    </v-tooltip>
                  </div>
                  <div v-else>
                    <v-btn text disabled>
                      <v-icon>mdi-book</v-icon>
                    </v-btn>
                  </div>
                </div>
              </v-flex>
            </v-layout>
            <v-divider></v-divider>
          </v-card>
        </div>
        <div v-else>
          <h1 class="grey--text mb-5">{{ this.msg }}</h1>
        </div>
      </div>
      <div v-if="buchinfo">
        <v-autocomplete
          v-model="buch"
          :items="alleBuecher"
          label="Buchnr"
          item-text="buchnr"
          :rules="Rules"
          return-object
        >
        </v-autocomplete>

        <v-text-field v-model="isbn" label="ISBN" readonly></v-text-field>

        <v-text-field v-model="title" label="Title" readonly></v-text-field>

        <v-text-field v-model="autor" label="Autor" readonly></v-text-field>

        <v-text-field v-model="jahr" label="Jahr" readonly></v-text-field>

        <v-text-field v-model="verlag" label="Verlag" readonly></v-text-field>

        <div v-if="buch.schueler != null">
          <v-card flat>
            <v-layout row wrap>
              <v-flex xs6 sm6 md6 lg6 xl6>
                <div class="caption grey--text mb-1 mx-4">
                  Zurzeit verliehen an den Schüler
                </div>
                <div class="mx-4">{{ buch.schueler }}</div>
              </v-flex>
              <v-flex xs6 sm6 md6 lg6 xl6>
                <div class="caption grey--text mb-1 mx-4">aus der Klasse</div>
                <div class="mx-4">{{ buch.klasse }}</div>
              </v-flex>
            </v-layout>
          </v-card>
        </div>
      </div>
    </v-form>
  </v-container>
</template>

<script>
import GetData from "@/services/GetData.js";
import SetData from "@/services/SetData.js";

export default {
  name: "BuecherErstellung",
  data() {
    return {
      items: "",
      sehen: false,
      schuelerliste: "",
      schueler: "",
      klassenliste: "",
      vergebeneBuecher: "",
      alleBuecher: "",
      klasse: "",
      select: "",
      auswahl: true,
      isbn: "",
      buchinfo: false,
      buchnr: "",
      buchid: "",
      title: "",
      autor: "",
      jahr: "",
      verlag: "",
      buecher: "",
      buch: "",
      buchHinzu: false,
      verleih: false,
      termine: "",
      msg: "",
      dialog: false,
      snackbarErf: false,
      snackbarErr: false,
      Rules: [(v) => !!v || `Füllen Sie bitte dieses Feld aus.`],
      jahrRules: [
        (v) => v.length == 4 || `Geben Sie bitte ein gültiges Jahr ein.`,
      ],
    };
  },
  async created() {
    if (
      !this.$store.getters.istEingeloggtLehrerBuchAdmin &&
      !this.$store.getters.istEingeloggtLehrerAdmin
    ) {
      this.$router.push("/login");
    }
  },

  methods: {
    async getBuecher() {
      try {
        const response = await GetData.getBuecher();

        this.items = response.result;
      } catch (err) {
        this.items = err.response.data.msg;
      }
    },

    async BuchZurueckgegeben() {
      this.dialog = false;
      try {
        const credentails = {
          ausleihbuchid: this.buchid.ausleihbuchid,
        };

        const response = await SetData.BuchZurueckgegeben(credentails);

        this.msg = response.msg;
        this.snackbarErf = true;
        this.VergebeBuecher();
      } catch (err) {
        this.msg = err.response.data.msg;
        this.snackbarErr = true;
      }
    },

    async buchHinzufuegen() {
      if (this.$refs.form.validate()) {
        try {
          const credentails = {
            buchnr: this.buchnr,
            isbn: this.isbn,
            title: this.title,
            jahr: this.jahr,
            autor: this.autor,
            verlag: this.verlag,
          };

          const response = await SetData.buchHinzufuegen(credentails);

          this.msg = response.msg;
          this.snackbarErf = true;
        } catch (err) {
          this.msg = err.response.data.msg;
          this.snackbarErr = true;
        }
      }
    },
    async getKlasse() {
      try {
        const response = await GetData.getK();

        this.klassenliste = response.result;
      } catch (err) {
        console.log(err);
        this.msg = err.response.data.msg;
        this.snackbarErr = true;
      }
    },

    async getSchuelerKlasse() {
      try {
        const credentails = {
          klassenid: this.klasse.klassenid,
        };

        const response = await GetData.getSchuelerKlasse(credentails);

        this.schuelerliste = response.result;
      } catch (err) {
        this.msg = err.response.data.msg;
        this.snackbarErr = true;
      }
    },

    async GetVerliehenesBuch() {
      try {
        const response = await GetData.getVerliehenesBuch();
        this.alleBuecher = response.result;
      } catch (err) {
        this.msg = err.response.data.msg;
      }
    },

    async getBuchnr() {
      try {
        const credentails = {
          isbn: this.select.isbn,
        };

        const response = await GetData.getBuchNummer(credentails);

        this.buecher = response.result;
      } catch (err) {
        this.msg = err.response.data.msg;
        this.snackbarErr = true;
      }
    },

    async verleihungHinzufuegen() {
      try {
        const credentails = {
          schuelerid: this.schueler.schuelerid,
          buchnr: this.buch,
        };

        const response = await SetData.VerleihungEintragen(credentails);

        this.msg = response.msg;
        this.snackbarErf = true;
        this.getBuchnr();
      } catch (err) {
        this.msg = err.response.data.msg;
        this.snackbarErr = true;
      }
    },

    async VergebeBuecher() {
      try {
        const credentails = {
          schuelerid: this.schueler.schuelerid,
        };
        const response = await GetData.getVergebeneBuecher(credentails);
        this.vergebeneBuecher = response.ergebnis;
      } catch (err) {
        this.msg = err.response.data.msg;
      }
    },

    Umschalten() {
      this.buchHinzu = false;
      this.verleih = false;
      this.auswahl = true;
      this.sehen = false;
      this.buchinfo = false;
    },
  },
  watch: {
    klasse: function () {
      this.getSchuelerKlasse();
      this.schueler = "";
    },
    buchHinzu: function () {
      this.auswahl = false;
      this.getBuecher();
    },
    verleih: function () {
      this.auswahl = false;
      this.getKlasse();
      this.getBuecher();
    },
    sehen: function () {
      this.auswahl = false;
      this.getKlasse();
      this.getBuecher();
    },
    buchinfo: function () {
      this.auswahl = false;
      this.GetVerliehenesBuch();
    },
    schueler: function () {
      if (this.sehen) {
        this.VergebeBuecher();
        this.vergebeneBuecher = "";
      }
    },
    buch: function () {
      this.isbn = this.buch.isbn;
      this.title = this.buch.title;
      this.autor = this.buch.autor;
      this.jahr = this.buch.jahr;
      this.verlag = this.buch.verlag;
    },
    select: function () {
      if (this.select.title != "") {
        this.isbn = this.select.isbn;
        this.title = this.select.title;
        this.autor = this.select.autor;
        this.jahr = this.select.jahr;
        this.verlag = this.select.verlag;
      }
      this.getBuchnr();
    },
  },
};
</script>

<style>
.status.null {
  border-left: 4px solid green;
}
.status {
  border-left: 4px solid red;
}
</style>