<template>
  <v-container class="my-5">
    <h3 class="grey--text mb-5">Ihre Termine</h3>
     
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
    
    <v-dialog v-model="dialog" max-width="460">
      <v-card>
        <v-card-title
          >Sind Sie sich sicher das Sie am {{ terminid.datum }} um
          {{ terminid.uhrzeit }} den Termin bei dem Lehrer {{ terminid.lehrerkuerzel }}
          stonieren wollen?</v-card-title
        >

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="red darken-1" text @click="dialog = false"
            >abbrechen</v-btn
          >

          <v-btn color="green darken-1" text @click="TerminStonieren()"
            >reservieren</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <div v-if="termine">
      <v-card flat v-for="termin in termine" :key="termin.terminId">
        <v-layout row wrap class="pa-3 termin">
          <v-flex xs3 sm3 md3 lg3 xl3>
            <div class="caption grey--text mb-1 mx-4">Datum</div>
            <div class="mx-4">{{ termin.datum }}</div>
          </v-flex>
          <v-flex xs3 sm3 md3 lg3 xl3>
            <div class="caption grey--text mb-1 mx-4">Uhrzeit</div>
            <div class="mx-4">{{ termin.uhrzeit }}</div>
          </v-flex>
          <v-flex xs2 sm2 md2 lg2 xl2>
            <div class="caption grey--text mb-1 mx-4">Lehrer</div>
            <div class="mx-4">{{ termin.lehrerkuerzel }}</div>
          </v-flex>
          <v-flex xs2 sm2 md2 lg2 xl2>
            <div class="caption grey--text mb-1 mx-4">Raum</div>
            <div class="mx-4">{{ termin.raum }}</div>
          </v-flex>
          <v-flex xs2 sm2 md2 lg2 xl2>
            <div class="caption grey--text">Termin stonieren</div>
            <div class="mx-4">
              <v-tooltip top>
                <template v-slot:activator="{ on }">
                  <v-btn
                    text
                    v-on="on"
                    @click="terminid = termin"
                    @click.stop="dialog = true"
                  >
                    <v-icon>mdi-cancel</v-icon>
                  </v-btn>
                </template>
                <span
                  >Wenn Sie den Button anklicken stonieren Sie ihren
                  Termin</span
                >
              </v-tooltip>
            </div>
          </v-flex>
        </v-layout>
        <v-divider></v-divider>
      </v-card>
    </div>

    <div v-else>
      <h1 class="grey--text">{{ msg }}</h1>
    </div>
  </v-container>
</template>

<script>
import GetData from "@/services/GetData.js";
import RemoveData from "@/services/RemoveData.js";

export default {
  name: "MeineTermineSchueler",
  data() {
    return {
      termine: "",
      terminid: "",
      msg: "",
      dialog: false,
      snackbarErf: false,
      snackbarErr: false,
    };
  },
  async created() {
    if (!this.$store.getters.istEingeloggtSchueler) {
      this.$router.push("/login");
    }
    this.getMeineTermine();
  },

  methods: {
    async getMeineTermine() {
      try {
        const credentails = {
          schuelerid: this.$store.getters.getSchueler.schuelerid,
          klassenid: this.$store.getters.getSchueler.klassenid,
        };

        const response = await GetData.getMeineTermineSchueler(credentails);

        this.termine = response.result;
      } catch (err) {
        this.msg = err.response.data.msg;
      }
    },
    async TerminStonieren() {
      try {
        this.dialog = false

        const credentails = {
          schuelerid: this.$store.getters.getSchueler.schuelerid,
          terminid: this.terminid.sltid,
        };

        const response = await RemoveData.removeTS(credentails);

        this.msg = response.msg
        this.snackbarErf = true
        this.getMeineTermine()
      } catch (err) {
        console.log(err)
        this.msg = err.response.data.msg
        this.snackbarErr = true
      }
    },
  },
};
</script>

<style>
</style>