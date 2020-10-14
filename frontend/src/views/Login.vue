<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm10 md8 lg6 xl4>
        <v-form ref="form">
          <v-card>
            <v-toolbar dark color="#ff0000">
              <v-spacer />
              <v-toolbar-title center>Login</v-toolbar-title>
              <v-spacer />
            </v-toolbar>
            <v-card-text>
              <v-text-field
                v-model="benutzername"
                prepend-icon="mdi-account"
                name="benutzername"
                label="Benutzername"
                type="text"
                @keyup.enter="login()"
                :rules="[rules.required]"
              ></v-text-field>

              <v-text-field
                v-model="passwort"
                prepend-icon="mdi-lock"
                name="passwort"
                label="Passwort"
                type="password"
                @keyup.enter="login()"
                :rules="[rules.required]"
              ></v-text-field>
            </v-card-text>
            <v-divider light></v-divider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn rounded color="black" dark @click="login">
                Einloggen
                <v-icon>mdi-arrow-right</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-form>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
import AuthService from '@/services/AuthService.js'

export default {
  name: "login",
  data: () => ({
    return: {
      fehler: false,
      benutzername: "",
      passwort: "",
      msg: "asd",
    },

    rules: {
      required: (value) => !!value || "Ungültige Informationen",
    },
  }),

  methods: {
    async login() {
      if (this.$refs.form.validate()) {
        try{
          const credentails = {
            benutzername: this.benutzername,
            passwort: this.passwort
          }

          const response = await AuthService.loginSchueler(credentails)
          this.msg = response.msg

          const token = response.token
          const schueler = response.schueler

          this.$store.dispatch("loginSchueler", {token, schueler})
          this.$router.push("/")

        }catch (err){
          try{
            const credentails = {
              benutzername: this.benutzername,
              passwort: this.passwort
            }

            const response = await AuthService.loginLehrer(credentails)
            this.msg = response.msg

            const token = response.token
            const lehrer = response.lehrer

            if(response.lehrer.ist_admin == 0){
              this.$store.dispatch("loginLehrer", {token, lehrer})
            } else if (response.lehrer.ist_admin == 1){
              this.$store.dispatch("loginLehrerAdmin", {token, lehrer})
            }else{
              this.$store.dispatch("loginLehrerBuchAdmin", {token, lehrer})
            }

            this.$router.push("/");
          } catch (err){
            this.msg = err.data.response.msg
            this.msg = "Yarrak"
          }
        }
      }
    },
  },
  async created() {
    if (
      this.$store.getters.istEingeloggtSchueler ||
      this.$store.getters.istEingeloggtLehrer ||
      this.$store.getters.istEingeloggtLehrerAdmin ||
      this.$store.getters.istEingeloggtLehrerBuchAdmin
    ) {
      this.$router.push("/");
    }
  },
};
</script>