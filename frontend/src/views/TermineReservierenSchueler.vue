<template>
  <v-container class="my-5">
    <v-dialog v-model="dialog" max-width="460">
      <v-card>
        <v-card-title
          >Sind Sie sich sicher das Sie am {{ terminid.datum }} um
          {{ terminid.uhrzeit }} den Termin bei {{lehrer.anredeid}} {{lehrer.nachname}} reservieren wollen?</v-card-title
        >

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="red darken-1" text @click="dialog = false"
            >abbrechen</v-btn
          >

          <v-btn color="green darken-1" text @click="setReservierung()"
            >reservieren</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

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
    <v-flex xs12 sm12 md12 lg12 xl12>
      <h4 class="subheading grey--text">Lehrer auswählen</h4>
      <v-select
        v-model="lehrer"
        :items="alleLehrer"
        item-text="lehrerkuerzel"
        return-object
      ></v-select>
      <br />
    </v-flex>

    <div class="terminplan">
      <h3 class="subheading grey--text">Terminplan</h3>
      <h4 class="grey--text">{{ lehrer.vorname }} {{ lehrer.nachname }}</h4>
      <br />
    </div>

    <v-card flat v-for="uhrzeit in uhrzeiten" :key="uhrzeit.status">
      <v-layout row wrap :class="`pa-3 status ${uhrzeit.schuelerid}`">
        <v-flex xs4 sm4 md3 lg3 xl3>
          <div class="caption grey--text mb-1 mx-4">Datum</div>
          <div class="mx-4">{{ uhrzeit.datum }}</div>
        </v-flex>
        <v-flex xs4 sm4 md3 lg3 xl3>
          <div class="caption grey--text mb-1 mx-4">Uhrzeit</div>
          <div class="mx-4">{{ uhrzeit.uhrzeit }}</div>
        </v-flex>
        <v-flex xs2 sm2 md3 lg3 xl3>
          <div class="caption grey--text mb-1 mx-4">Raum</div>
          <div class="mx-4">{{ uhrzeit.raum }}</div>
        </v-flex>
        <v-flex xs2 sm2 md3 lg3 xl3>
          <div class="caption grey--text">Reservieren</div>
          <div v-if="uhrzeit.schuelerid == NULL">
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-btn
                  text
                  v-on="on"
                  @click="terminid = uhrzeit"
                  @click.stop="dialog = true"
                >
                  <v-icon>mdi-book</v-icon>
                </v-btn>
              </template>
              <span
                >Jetzt den Button anklicken um die reservierung
                einzutragen</span
              >
            </v-tooltip>
          </div>
          <div v-else>
            <v-btn text disabled>
              <v-icon>mdi-book</v-icon>
            </v-btn>
          </div>
        </v-flex>
      </v-layout>
      <v-divider></v-divider>
    </v-card>
  </v-container>
</template>

<script>
import GetData from "@/services/GetData.js";
import SetData from "@/services/SetData.js";

export default {
  name: "TermineReservierenSchueler",
  data() {
    return {
      alleLehrer: "",
      lehrer: "",
      msg: "",
      uhrzeiten: "",
      terminid:"",
      dialog: false,
      snackbarErf: false,
      snackbarErr: false,
    };
  },

  async created() {
    if (!this.$store.getters.istEingeloggtSchueler) {
      this.$router.push("/Login");
    }

    try {
      const response = await GetData.getLehrer();
      this.alleLehrer = response.result;
    } catch (err) {
      this.msg = err.response.data.msg
    }
  },
  methods: {
    async getTermine() {
      try {
        const credentails = {
          lehrerid: this.lehrer.lehrerkuerzel,
        };

        const response = await GetData.getTermine(credentails);
        this.uhrzeiten = response.result;
      } catch (err) {
        this.msg = err.response.data.msg
      }
    },

    async setReservierung(){
      try{
        this.dialog = false
        const credentails = {
          sltid: this.terminid.sltid,
          schuelerid: this.$store.getters.getSchueler.schuelerid,
        }

        const response = await SetData.setReservierungSchueler(credentails)
        this.msg = response.msg
        this.snackbarErf = true

      }catch (err){
        this.msg = err.response.data.msg
        this.snackbarErr = true
      }
      this.getTermine()
    }
  },
  watch: {
    lehrer: function () {
      this.getTermine();
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