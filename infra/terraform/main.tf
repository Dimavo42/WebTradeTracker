data "vsphere_datacenter" "dc" {
  name = "Datacenter"
}

data "vsphere_network" "vm_network" {
  name          = "VM Network"
  datacenter_id = data.vsphere_datacenter.dc.id
}

resource "vsphere_virtual_machine" "webtrade_vm" {
  name     = "webtrade-prod"
  num_cpus = 2
  memory   = 4096

  disk {
    label = "disk0"
    size  = 40
  }

  network_interface {
    network_id = data.vsphere_network.vm_network.id
  }
}