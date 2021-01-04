<template>
  <v-container class="my-5">
    <v-form ref="form">
      <h3 class="grey--text mb-5">Krankschreibung</h3>
      <div v-if="!auswahl">
        <v-btn text @click="Umschalten"
          ><v-icon>mdi-keyboard-return</v-icon>zurück</v-btn
        >
      </div>
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
      <div v-if="auswahl">
        <v-container class="my-5 mx-5">
          <v-btn block @click="erstellen = true"
            >Krankschreibungen erstellen</v-btn
          >
        </v-container>
        <v-container class="my-5 mx-5">
          <v-btn block @click="sehen = true">Krankschreibungen ansehen</v-btn>
        </v-container>
      </div>
      <div v-if="erstellen">
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
            <v-date-picker
              v-model="dates"
              multiple
              no-title
              scrollable
              locale="de"
            >
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="menu = false"
                >Abbrechen</v-btn
              >
              <v-btn text color="primary" @click="$refs.menu.save(dates)"
                >OK</v-btn
              >
            </v-date-picker>
          </v-menu>
        </v-col>
        <v-file-input
          v-model="file"
          placeholder="Upload your documents"
          label="File input"
          ref="file"
          prepend-icon="mdi-paperclip"
          @change="onFileChange()"
        >
          <template v-slot:selection="{ text }">
            <v-chip small label color="primary">
              {{ text }}
            </v-chip>
          </template>
        </v-file-input>

        <h4>{{msg}}</h4>
        <h4>{{file}}</h4>

        <div align="center">
          <v-btn @click="onUploadFile()">Krankschreibung Hochladen</v-btn>
        </div>
      </div>
    </v-form>
  </v-container>
</template>


<script>
//import GetData from "@/services/GetData.js";
import SetData from "@/services/SetData.js";

export default {
  name: "Krankschreibung",
  data() {
    return {
      file: "",
      dates: [],
      menu: false,
      menu2: false,
      modal: false,
      erstellen: false,
      sehen: false,
      auswahl: true,
      snackbarErf: false,
      snackbarErr: false,
      msg: "",
      rules: [(v) => !!v || `Füllen Sie bitte dieses Feld aus.`],
    };
  },
  async created() {
    if (!this.$store.getters.istEingeloggtSchueler) {
      this.$router.push("/login");
    }
  },
  computed: {
    dateRangeText() {
      return this.dates.join(" ~ ");
    },
  },

  methods: {
    Umschalten() {
      this.auswahl = true;
      this.erstellen = false;
      this.sehen = false;
    },
    selectFile(){
        this.file = this.$refs.file.file[0];
    },
    async onUploadFile(){
        const formData = new FormData();
        formData.append("file", this.file)
        
        console.log(this.file)
        try{
            const respone = await SetData.upload(formData)
            this.msg = respone.msg;
            
        }catch(err){
            console.log(err)
            this.msg = err.response.data.msg;
        }
    }
  },
  watch: {
    erstellen: function () {
      this.auswahl = false;
    },
    sehen: function () {
      this.auswahl = false;
    },
  },
};
</script>

<style>
</style>