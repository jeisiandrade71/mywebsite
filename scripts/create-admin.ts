import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";
import bcrypt from "bcryptjs";
import { getAdminsCollection } from "../src/lib/admins";

async function main() {
  // Modo não-interativo (ex: rodado a partir de outro script/automação):
  // ADMIN_EMAIL + ADMIN_PASSWORD via variável de ambiente pulam os prompts.
  let email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  let password = process.env.ADMIN_PASSWORD;
  let confirm = password;

  if (!email || !password) {
    const rl = createInterface({ input: stdin, output: stdout });
    email = (await rl.question("Email do admin: ")).trim().toLowerCase();
    console.log("Atenção: a senha vai aparecer na tela enquanto você digita.");
    password = await rl.question("Senha: ");
    confirm = await rl.question("Confirme a senha: ");
    rl.close();
  }

  if (!email || !password) {
    console.error("Email e senha são obrigatórios.");
    process.exit(1);
  }

  if (password !== confirm) {
    console.error("As senhas não conferem.");
    process.exit(1);
  }

  if (password.length < 8) {
    console.error("A senha precisa ter pelo menos 8 caracteres.");
    process.exit(1);
  }

  const admins = await getAdminsCollection();
  const existing = await admins.findOne({ email });

  const passwordHash = await bcrypt.hash(password, 12);

  if (existing) {
    await admins.updateOne({ email }, { $set: { passwordHash } });
    console.log(`Senha atualizada para o admin existente: ${email}`);
  } else {
    await admins.insertOne({ email, passwordHash, createdAt: new Date() });
    console.log(`Admin criado: ${email}`);
  }

  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
