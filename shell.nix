{ pkgs ? import <nixpkgs> {} }:
pkgs.mkShell {
  packages = with pkgs; [
    # Editor language servers (LSP): JS/JSX, SCSS/CSS/JSON/HTML
    typescript-language-server
    vscode-langservers-extracted
  ];
}
