import json
import os
import random
from datetime import datetime, timedelta

os.makedirs('data', exist_ok=True)

# medicos.json
municipios = ["Fortaleza", "Sobral", "Juazeiro do Norte", "Maracanaú", "Caucaia", "Crato", "Itapipoca", "Quixadá", "Iguatu", "Pacajus", "Aquiraz", "Eusébio", "Barbalha", "Tianguá", "Canindé", "Crateús", "Aracati", "Morada Nova", "Limoeiro do Norte", "Camocim"]
regionais = ["TRÍGESIMO QUINTO", "PRIMEIRO", "DÉCIMO PRIMEIRO", "SEGUNDO", "TERCEIRO", "QUARTO", "QUINTO"]
tipos = ["INTERCAMBISTA MAIS MÉDICOS", "CRM BRASIL MAIS MÉDICOS"]
vulnerabilidades = ["Média Vulnerabilidade", "Alta Vulnerabilidade", "Muito Alta Vulnerabilidade", "Sem Vulnerabilidade"]
nomes_medicos = ["Ana Silva", "Bruno Costa", "Carlos Souza", "Diana Lima", "Eduardo Mendes", "Fernanda Alves", "Gabriel Rocha", "Helena Gomes", "Igor Santos", "Julia Carvalho", "Lucas Martins", "Mariana Pereira", "Nicolas Araujo", "Olivia Ribeiro", "Paulo Barbosa", "Quintino Castro", "Rafaela Melo", "Samuel Nogueira", "Tais Farias", "Ulysses Cardoso", "Vitoria Cunha", "Wagner Pires", "Xuxa Meneghel", "Yuri Moura", "Zelia Duncan", "Aline Barros", "Breno Lopes", "Camila Pitanga", "Daniel Alves", "Elisa Lucinda", "Fabio Assunção", "Gisele Bundchen"]

medicos = []
for i in range(30):
    medicos.append({
        "id": i + 1,
        "nome": nomes_medicos[i % len(nomes_medicos)],
        "cpf": f"{random.randint(100, 999)}.{random.randint(100, 999)}.{random.randint(100, 999)}-{random.randint(10, 99)}",
        "municipio": random.choice(municipios),
        "regional": random.choice(regionais),
        "tipo": random.choice(tipos),
        "vulnerabilidade": random.choice(vulnerabilidades),
        "inicio": (datetime(2023, 1, 1) + timedelta(days=random.randint(0, 1000))).strftime("%Y-%m-%d"),
        "contato_email": f"medico{i+1}@exemplo.com",
        "contato_telefone": f"(85) 9{random.randint(8000, 9999)}-{random.randint(1000, 9999)}"
    })
with open('data/medicos.json', 'w', encoding='utf-8') as f:
    json.dump(medicos, f, ensure_ascii=False, indent=2)

# supervisores.json
instituicoes = ["ESCOLA DE SAÚDE DA FAMÍLIA VISCONDE DE SABÓIA", "ESCOLA DE SAÚDE PÚBLICA DO CEARÁ", "UNIVERSIDADE FEDERAL DO CEARÁ", "UNIVERSIDADE FEDERAL DO CARIRI", "SECRETARIA MUNICIPAL DE SAÚDE DE FORTALEZA", "UNIVERSIDADE DA INTEGRAÇÃO INTERNACIONAL DA LUSOFONIA AFRO-BRASILEIRA"]
titulacoes = ["Mestrado", "Doutorado", "Especialização", "Residência Médica", "Graduação"]
especialidades = ["Saúde da Família", "Clínica Médica", "Pediatria", "Saúde Coletiva"]

supervisores = []
for i in range(20):
    supervisores.append({
        "id": i + 1,
        "nome": f"Supervisor {i+1}",
        "residencia": random.choice(municipios),
        "instituicao": random.choice(instituicoes),
        "titulacao": random.choice(titulacoes),
        "especialidade": random.choice(especialidades),
        "situacao": "Ativo"
    })
with open('data/supervisores.json', 'w', encoding='utf-8') as f:
    json.dump(supervisores, f, ensure_ascii=False, indent=2)

# secretarios.json
secretarios = []
for i in range(20):
    secretarios.append({
        "id": i + 1,
        "nome": f"Secretário {i+1}",
        "municipio": random.choice(municipios),
        "regiao": f"{random.randint(1, 20)}ª Região",
        "telefone": f"(85) 9 {random.randint(8000, 9999)}-{random.randint(1000, 9999)}",
        "email": f"sec{i+1}@exemplo.com",
        "endereco": f"Rua {i+1}, Centro"
    })
with open('data/secretarios.json', 'w', encoding='utf-8') as f:
    json.dump(secretarios, f, ensure_ascii=False, indent=2)

# referencias.json
referencias = [
    {"id": 1, "nome": "Tatiane Almeida", "regioes": "Norte, Sertão Central", "municipios": 75, "vagas": 455, "medicos_ativos": 411, "desocupadas": 74},
    {"id": 2, "nome": "Alyne Cuba", "regioes": "Cariri, Litoral Leste", "municipios": 65, "vagas": 313, "medicos_ativos": 265, "desocupadas": 48},
    {"id": 3, "nome": "Marcossuel Acioles", "regioes": "Fortaleza", "municipios": 44, "vagas": 546, "medicos_ativos": 415, "desocupadas": 92}
]
with open('data/referencias.json', 'w', encoding='utf-8') as f:
    json.dump(referencias, f, ensure_ascii=False, indent=2)

# instituicoes.json
instituicoes_data = [
    {"id": 1, "nome": "ESCOLA DE SAÚDE DA FAMÍLIA VISCONDE DE SABÓIA", "sigla": "ESFVS", "uf": "CE", "num_supervisores": 40, "num_cidades": 5, "cidades": ["Sobral", "Meruoca", "Massapê", "Alcântaras", "Santana do Acaraú"]},
    {"id": 2, "nome": "ESCOLA DE SAÚDE PÚBLICA DO CEARÁ", "sigla": "ESP-CE", "uf": "CE", "num_supervisores": 30, "num_cidades": 8, "cidades": ["Fortaleza", "Caucaia", "Maracanaú", "Eusébio", "Aquiraz", "Pacatuba", "Itaitinga", "Guaiúba"]},
    {"id": 3, "nome": "SECRETARIA MUNICIPAL DE SAÚDE DE FORTALEZA", "sigla": "SMS/FOR", "uf": "CE", "num_supervisores": 21, "num_cidades": 2, "cidades": ["Fortaleza", "Eusébio"]},
    {"id": 4, "nome": "UNIVERSIDADE FEDERAL DO CEARÁ", "sigla": "UFC", "uf": "CE", "num_supervisores": 20, "num_cidades": 2, "cidades": ["Fortaleza", "Sobral"]},
    {"id": 5, "nome": "UNIVERSIDADE FEDERAL DO CARIRI", "sigla": "UFCA", "uf": "CE", "num_supervisores": 20, "num_cidades": 3, "cidades": ["Juazeiro do Norte", "Crato", "Barbalha"]},
    {"id": 6, "nome": "UNIVERSIDADE DA INTEGRAÇÃO INTERNACIONAL DA LUSOFONIA AFRO-BRASILEIRA", "sigla": "UNILAB", "uf": "CE", "num_supervisores": 8, "num_cidades": 4, "cidades": ["Redenção", "Acarape", "Baturité", "Aracoiaba"]}
]
with open('data/instituicoes.json', 'w', encoding='utf-8') as f:
    json.dump(instituicoes_data, f, ensure_ascii=False, indent=2)

# processos.json
processos = []
tipos_sol = ["FINANCEIRO", "REMANEJAMENTO", "DEVOLUÇÃO", "REDUÇÃO DE CARGA HORÁRIA"]
refs = ["MAR", "Tatiane Almeida", "TATIANE ALMEIDA", "ALYNE CUBA", "NÍVEL CENTRAL"]
for i in range(8):
    status = "FINALIZADO" if i < 6 else "PENDENTE"
    nivel = "URGENTE" if i < 2 else "NORMAL"
    processos.append({
        "id": i + 1,
        "municipio": random.choice(municipios),
        "tipo_solicitacao": random.choice(tipos_sol),
        "status": status,
        "nivel": nivel,
        "referencia": random.choice(refs),
        "data_recebimento": (datetime(2026, 1, 1) + timedelta(days=random.randint(0, 180))).strftime("%Y-%m-%d")
    })
with open('data/processos.json', 'w', encoding='utf-8') as f:
    json.dump(processos, f, ensure_ascii=False, indent=2)

# tutores.json
with open('data/tutores.json', 'w', encoding='utf-8') as f:
    json.dump([], f, ensure_ascii=False, indent=2)
