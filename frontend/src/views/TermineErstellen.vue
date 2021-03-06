<template>
  <v-container class="my-5">
    <div>
      <v-snackbar v-model="snackbarErf" multi-line="true" color="primary" timeout="5000">
        {{msg}}
        <template>
          <v-btn color="white" text @click="snackbarErf = false" class="ml4">
            <v-icon right>mdi-window-close</v-icon>
          </v-btn>
        </template>
      </v-snackbar>
    </div>
    <div>
      <v-snackbar v-model="snackbarErr" multi-line="true" color="error" timeout="5000">
        {{msg}}
        <template>
          <v-btn color="white" text @click="snackbarErr = false" class="ml4">
            <v-icon right>mdi-window-close</v-icon>
          </v-btn>
        </template>
      </v-snackbar>
    </div>
    <h4 class="grey--text">Wann wollen Sie ein Termin erstellen?</h4>
    <v-col align="center">
      <v-menu
        ref="menu"
        v-model="menu"
        :close-on-content-click="false"
        :return-value.sync="dates"
        transition="scale-transition"
        offset-y
        min-width="290px"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-combobox
            v-model="dates"
            multiple
            chips
            small-chips
            label="Datum auswählen"
            prepend-icon="mdi-calendar-range"
            readonly
            v-bind="attrs"
            v-on="on"
            :rules="[rules.required]"
          ></v-combobox>
        </template>
        <v-date-picker v-model="dates" multiple no-title scrollable locale="de">
          <v-spacer></v-spacer>
          <v-btn text color="primary" @click="menu = false">Abbrechen</v-btn>
          <v-btn text color="primary" @click="$refs.menu.save(dates)">OK</v-btn>
        </v-date-picker>
      </v-menu>
    </v-col>
    <h4 class="grey--text">Um wie viel Uhr?</h4>

    <div>
      <v-row>
        <v-col cols="12" sm="6">
          <v-dialog
            ref="dialog1"
            v-model="modal1"
            :return-value.sync="start"
            persistent
            width="290px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="start"
                label="Start"
                prepend-icon="mdi-clock-outline"
                readonly
                v-bind="attrs"
                v-on="on"
                :rules="[rules.required]"
              ></v-text-field>
            </template>
            <v-time-picker
              v-if="modal1"
              v-model="start"
              full-width
              format="24hr"
              :max="end"
              :allowed-minutes="allowedStep"
            >
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="modal1 = false"
                >Abbrechen</v-btn
              >
              <v-btn text color="primary" @click="$refs.dialog1.save(start)"
                >OK</v-btn
              >
            </v-time-picker>
          </v-dialog>
        </v-col>
        <v-spacer></v-spacer>
        <v-col cols="12" sm="6">
          <v-dialog
            ref="dialog"
            v-model="modal2"
            :return-value.sync="end"
            persistent
            width="290px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="end"
                label="Ende"
                prepend-icon="mdi-clock-outline"
                readonly
                v-bind="attrs"
                v-on="on"
                :rules="[rules.required]"
              ></v-text-field>
            </template>
            <v-time-picker
              v-if="modal2"
              v-model="end"
              full-width
              format="24hr"
              :min="start"
              :allowed-minutes="allowedStep"
            >
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="modal2 = false"
                >Abbrechen</v-btn
              >
              <v-btn text color="primary" @click="$refs.dialog.save(end)"
                >OK</v-btn
              >
            </v-time-picker>
          </v-dialog>
        </v-col>
      </v-row>
    </div>
    <h4 class="grey--text">
      Für welche Lehrer sollen diese Termine in der Datenbank eingetragen
      werden?
    </h4>
    <br />
    <v-select
      v-model="ausgewaehlteLehrer"
      @change="onChange()"
      :items="lehrer"
      item-text="lehrerkuerzel"
      label="Lehrer"
      multiple
      prepend-icon="mdi-account-multiple-plus"
      return-object
    >
      <template v-slot:prepend-item>
        <v-list-item ripple @click="Umschalten()">
          <v-list-item-action>
            <v-icon
              :color="ausgewaehlteLehrer.length > 0 ? 'indigo darken-4' : ''"
              >{{ icon }}</v-icon
            >
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Alle auswählen</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider class="mt-2"></v-divider>
      </template>
    </v-select>
    <v-card
      flat
      v-for="(lehrer, indexLehrer) in ausgewaehlteLehrer"
      :key="lehrer.lehrerkuerzel"
    >
      <v-flex>
        <h4 align="center">
          Zu welchem Raum soll {{ lehrer.anredeid }}
          {{ lehrer.nachname }} zugewiesen werden?
        </h4>
        <div v-for="(raum, indexRaum) in raueme" :key="raum.raumid">
          <v-row align="center" justify="space-around">
            <v-btn
              depressed
              @click="RaumEntfernen(raum, indexLehrer, indexRaum)"
            >
              {{ raum.raum }}
            </v-btn>
          </v-row>
          <br />
        </div>
      </v-flex>
      <v-divider></v-divider>
    </v-card>
    <v-card flat v-for="termin in Termine" :key="termin.terminId">
      <v-layout row wrap class="pa-3 termin">
        <v-flex xs6 sm6 md6 lg6 xl6>
          <div class="caption grey--text mb-1 mx-4">Lehrer</div>
          <div class="mx-4">{{ termin.lehrer }}</div>
        </v-flex>
        <v-flex xs6 sm6 md6 lg6 xl6>
          <div class="caption grey--text mb-1 mx-4">Raum</div>
          <div class="mx-4">{{ termin.raum }}</div>
        </v-flex>
      </v-layout>
      <v-divider></v-divider>
    </v-card>
    <v-card-actions class="justify-center">
      <v-btn text @click="Absenden()">Erstellen</v-btn>
    </v-card-actions>
  </v-container>
</template>

<script>
import GetData from "@/services/GetData.js";
import SetData from "@/services/SetData.js";

export default {
  name: "TermineErstellenAdmin",
  data() {
    return {
      dates: [],
      time: null,
      menu: false,
      menu2: false,
      modal: false,
      modal1: false,
      modal2: false,
      start: null,
      end: null,
      lehrer: "",
      anrede: "",
      ausgewaehlteLehrer: [],
      ausgewaehlteLehrerKopie: [],
      snackbarErf: "",
      snackbarErr: "",
      msg: "",
      raueme: "",
      Termine: [],

      rules: {
        required: (value) => !!value || "Ungültige Informationen",
      },
    };
  },

  async created() {
    if (!this.$store.getters.istEingeloggtLehrerAdmin) {
      this.$router.push("/Login");
    }
    
    try {
      const response = await GetData.getLehrer();
      this.lehrer = response.result;
    } catch (err) {
      this.lehrer = ["ERROR", "ERROR"];
    }

    try {
      const response2 = await GetData.getRaueme();
      this.raueme = response2.result;
    } catch (err) {
      this.raueme = ["ERROR", "ERROR"];
    }
  },

  computed: {
    alleLehrerAuswaehlen() {
      return this.ausgewaehlteLehrer.length === this.lehrer.length && this.onChange();
    },
    nichtAlleLehrerAuswaehlen() {
      return this.ausgewaehlteLehrer.length > 0 && !this.alleLehrerAuswaehlen;
    },
    icon() {
      if (this.alleLehrerAuswaehlen) return "mdi-close-box";
      if (this.nichtAlleLehrerAuswaehlen) return "mdi-minus-box";
      return "mdi-checkbox-blank-outline";
    },
  },

  methods: {
    allowedStep: (m) => m % 15 === 0,
    Umschalten() {
      this.$nextTick(() => {
        if (this.alleLehrerAuswaehlen) {
          this.ausgewaehlteLehrer = [];
        } else {
          this.ausgewaehlteLehrer = this.lehrer.slice();
        }
      });
    },

    onChange() {
      this.ausgewaehlteLehrerKopie = this.ausgewaehlteLehrer;
    },

    async Absenden() {
      if (
        this.start != null &&
        this.end != null &&
        this.Termine.length &&
        this.dates.length &&
        this.start != this.end 
      ) {
        try {
          const credentails = {
            datum: this.dates,
            uhrzeitStart: this.start,
            uhrzeitEnde: this.end,
            lehrerRaumm: this.Termine
          };

          const response = await SetData.setTermine(credentails);
          this.msg = response.msg;
          this.snackbarErf = true;
        } catch (err) {
          this.msg = err.response.data.msg;
          this.snackbarErr = true;
        }
      }
    },

    RaumEntfernen(raum, indexLehrer, indexRaum) {
      var berechtigung = true;

      for (let i = 0; i < this.Termine.length; i++) {
        if (this.ausgewaehlteLehrerKopie[indexLehrer].lehrerkuerzel == this.Termine[i].lehrer){
          berechtigung = false;
        }
      }

      if (berechtigung) {
        let Termin = {
          raum: raum.raum,
          raumid: raum.raumid,
          lehrer: this.ausgewaehlteLehrerKopie[indexLehrer].lehrerkuerzel,
        };

        this.Termine.push(Termin);
        this.ausgewaehlteLehrerKopie.splice(indexLehrer, 1);
        this.raueme.splice(indexRaum, 1);
      }else{
        this.ausgewaehlteLehrer = []
      }
    },
  },
};
</script>

<style>
h4 {
  text-align: center;
  color: #9e9e9e;
}
.termin {
  border-left: 4px solid green;
}
</style>