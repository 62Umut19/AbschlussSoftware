<template>
  <nav>
    <v-toolbar flat app>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title class="text-uppercase grey--text">
        <v-img width="300" src="../assets/logo.png"></v-img>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <div
        v-if="
          !this.$store.getters.istEingeloggtSchueler &&
          !this.$store.getters.istEingeloggtLehrer &&
          !this.$store.getters.istEingeloggtLehrerAdmin &&
          !this.$store.getters.istEingeloggtLehrerBuchAdmin
        "
      >
        <v-btn text @click="Einloggen">
          <span>Einloggen</span>
          <v-icon right>mdi-login-variant</v-icon>
        </v-btn>
      </div>
      <div if v-else>
        <v-btn text @click="Ausloggen">
          <span>Ausloggen</span>
          <v-icon right>mdi-exit-to-app</v-icon>
        </v-btn>
      </div>
    </v-toolbar>

    <v-navigation-drawer
      temporary
      v-model="drawer"
      app
      class="blue-grey lighten-5"
    >
      <v-list>
        <v-img width="300" src="../assets/logo.png"></v-img>
        <br />
        <h1 dark>Auswahlmenü</h1>
        <br />
        <h4 class="white--text"></h4>
        <br />
        <div v-if="this.$store.getters.istEingeloggtSchueler">
          <v-list-item
            v-for="link in linksSchueler"
            :key="link.text"
            router
            :to="link.route"
          >
            <v-list-item-action>
              <v-icon>{{ link.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>{{ link.text }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </div>
        <div v-else-if="this.$store.getters.istEingeloggtLehrer">
          <v-list-item
            v-for="link in linksLehrer"
            :key="link.text"
            router
            :to="link.route"
          >
            <v-list-item-action>
              <v-icon>{{ link.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>{{ link.text }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </div>
        <div v-else-if="this.$store.getters.istEingeloggtLehrerAdmin">
          <v-list-item
            v-for="link in linksLehrerAdmin"
            :key="link.text"
            router
            :to="link.route"
          >
            <v-list-item-action>
              <v-icon>{{ link.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>{{ link.text }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </div>
        <div v-else-if="this.$store.getters.istEingeloggtLehrerBuchAdmin">
          <v-list-item
            v-for="link in linksLehrerBuchAdmin"
            :key="link.text"
            router
            :to="link.route"
          >
            <v-list-item-action>
              <v-icon>{{ link.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>{{ link.text }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </div>
        <div v-else>
          <v-list-item
            v-for="link in linksUnautorisiert"
            :key="link.text"
            router
            :to="link.route"
          >
            <v-list-item-action>
              <v-icon>{{ link.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>{{ link.text }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </div>
      </v-list>
    </v-navigation-drawer>
  </nav>
</template>

<script>
export default {
  data() {
    return {
      drawer: false,
      linksLehrerAdmin: [
        { icon: "mdi-home", text: "Home", route: "/" },
        {
          icon: "mdi-calendar",
          text: "Termine erstellen",
          route: "/TermineErstellen",
        },
      ],
      linksLehrerBuchAdmin: [{ icon: "mdi-home", text: "Home", route: "/" }],
      linksSchueler: [
        { icon: "mdi-home", text: "Home", route: "/" },
        {
          icon: "mdi-calendar",
          text: "Termin reservieren",
          route: "/TermineReservierenSchueler",
        },
      ],
      linksLehrer: [{ icon: "mdi-home", text: "Home", route: "/" }],
      linksUnautorisiert: [
        { icon: "mdi-home", text: "Home", route: "/" },
        { icon: "mdi-login-variant", text: "Einloggen", route: "/Login" },
      ],
    };
  },
  methods: {
    Ausloggen() {
      this.$store.dispatch("logout");
      this.$router.push("/");
    },
    Einloggen() {
      this.$router.push("/Login");
    },
  },
};
</script>