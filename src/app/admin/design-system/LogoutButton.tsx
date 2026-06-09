"use client";

import React from "react";
import { signOut } from "next-auth/react";
import styles from "./design-system.module.css";

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/admin/login" })}
      className={styles.logoutButton}
    >
      Sair
    </button>
  );
}
