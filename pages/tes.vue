<template>
  <div class="page">
    <!-- HEADER -->
    <header class="page-header">
      <div>
        <h1>Product Management</h1>
        <p>Manage your store products</p>
      </div>

      <button class="btn primary">+ Add Product</button>
    </header>

    <!-- FILTER BAR -->
    <section class="filter-bar">
      <input type="text" placeholder="Search product..." />

      <select>
        <option value="all">All Categories</option>
        <option value="Peripheral">Peripheral</option>
        <option value="Display">Display</option>
      </select>

      <select>
        <option value="all">All Status</option>
        <option value="active">Active</option>
        <option value="out_of_stock">Out of Stock</option>
        <option value="inactive">Inactive</option>
      </select>

      <select>
        <option value="">Sort By</option>
        <option value="name">Name</option>
        <option value="price">Price</option>
        <option value="stock">Stock</option>
        <option value="createdAt">Created Date</option>
      </select>
    </section>

    <!-- TABLE -->
    <section class="card">
      <table class="product-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th class="right">Price</th>
            <th>Stock</th>
            <th>Status</th>
            <th class="center">Action</th>
          </tr>
        </thead>

        <tbody>
          <!-- contoh static row (nanti ganti v-for) -->
          <tr>
            <td class="name">Mechanical Keyboard</td>
            <td><span class="badge">Peripheral</span></td>
            <td class="right">Rp 850.000</td>
            <td>12</td>
            <td><span class="status active">Active</span></td>
            <td class="center">
              <button class="icon-btn">✏️</button>
              <button class="icon-btn danger">🗑</button>
            </td>
          </tr>

          <tr>
            <td class="name">Wireless Mouse</td>
            <td><span class="badge">Peripheral</span></td>
            <td class="right">Rp 250.000</td>
            <td>0</td>
            <td><span class="status out">Out of Stock</span></td>
            <td class="center">
              <button class="icon-btn">✏️</button>
              <button class="icon-btn danger">🗑</button>
            </td>
          </tr>

          <tr>
            <td class="name">27 Inch Monitor</td>
            <td><span class="badge">Display</span></td>
            <td class="right">Rp 3.200.000</td>
            <td>5</td>
            <td><span class="status inactive">Inactive</span></td>
            <td class="center">
              <button class="icon-btn">✏️</button>
              <button class="icon-btn danger">🗑</button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <!-- PAGINATION -->
    <footer class="pagination">
      <span>Showing 1–10 of 48</span>

      <div class="pages">
        <button>&lt;</button>
        <button class="active">1</button>
        <button>2</button>
        <button>3</button>
        <button>&gt;</button>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: "ProductDashboard",
};
</script>

<style scoped>
* {
  box-sizing: border-box;
  font-family: Inter, system-ui, sans-serif;
}

.page {
  max-width: 1200px;
  margin: 32px auto;
  padding: 0 16px;
  color: #1f2937;
}

/* HEADER */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-header h1 {
  margin: 0;
  font-size: 24px;
}

.page-header p {
  margin: 4px 0 0;
  color: #6b7280;
}

/* BUTTON */
.btn {
  padding: 10px 16px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
}

.btn.primary {
  background: #2563eb;
  color: #fff;
}

/* FILTER BAR */
.filter-bar {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.filter-bar input,
.filter-bar select {
  padding: 10px 12px;
  border-radius: 6px;
  border: 1px solid #d1d5db;
  background: #fff;
}

/* CARD */
.card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

/* TABLE */
.product-table {
  width: 100%;
  border-collapse: collapse;
}

.product-table thead {
  background: #f9fafb;
}

.product-table th,
.product-table td {
  padding: 14px 16px;
  border-bottom: 1px solid #e5e7eb;
}

.product-table th {
  font-weight: 600;
  font-size: 14px;
}

.right {
  text-align: right;
}

.center {
  text-align: center;
}

.name {
  font-weight: 600;
}

/* BADGE */
.badge {
  background: #e5e7eb;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}

/* STATUS */
.status {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.status.active {
  background: #dcfce7;
  color: #166534;
}

.status.out {
  background: #fee2e2;
  color: #991b1b;
}

.status.inactive {
  background: #e5e7eb;
  color: #374151;
}

/* ICON BUTTON */
.icon-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  margin: 0 4px;
}

.icon-btn.danger {
  color: #dc2626;
}

/* PAGINATION */
.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
}

.pages button {
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid #d1d5db;
  background: #fff;
  margin-left: 4px;
  cursor: pointer;
}

.pages button.active {
  background: #2563eb;
  color: #fff;
  border-color: #2563eb;
}
</style>
