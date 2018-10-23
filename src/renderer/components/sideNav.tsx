import React from "react";

export default function Editor(props) {
  return (
    <div class="window-content">
      <nav class="nav-group" style="background-color: #f5f5f4;">
        <h5 class="nav-group-title">Favorites</h5>
        <a class="nav-group-item active">
          <span class="icon icon-home"></span>
          koki_cheese
        </a>
        <span class="nav-group-item">
          <span class="icon icon-download"></span>
          Downloads
        </span>
        <span class="nav-group-item">
          <span class="icon icon-folder"></span>
          Documents
        </span>
      </nav>
    </div>
  );
}
