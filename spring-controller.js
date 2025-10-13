#!/usr/bin/env node

const fs = require('fs');
const { execSync } = require('child_process');
const readline = require('readline');

class SpringDeployment {
  constructor() {
    this.stateFile = '.spring-state';
    this.maxCoils = 7;
    this.stages = [
      { name: 'init', desc: '🔧 Initialization', cmd: 'echo "Initializing..."' },
      { name: 'lint', desc: '🔍 Code Quality', cmd: 'npm run lint --silent' },
      { name: 'type', desc: '📝 TypeScript', cmd: 'npx tsc --noEmit --skipLibCheck' },
      { name: 'build', desc: '🏗️  Build Process', cmd: 'npm run build' },
      { name: 'test', desc: '🧪 Testing', cmd: 'npm test --silent --passWithNoTests' },
      { name: 'export', desc: '📦 Export', cmd: 'npm run export || echo "Export skipped"' },
      { name: 'deploy', desc: '🚀 Deploy', cmd: 'echo "🎉 Deployment Complete!"' }
    ];
    this.currentCoil = this.loadState();
  }

  loadState() {
    try {
      return parseInt(fs.readFileSync(this.stateFile, 'utf8')) || 0;
    } catch {
      return 0;
    }
  }

  saveState(coil) {
    fs.writeFileSync(this.stateFile, coil.toString());
  }

  drawSpring(current, status = 'idle') {
    console.clear();
    console.log('\n🌀 SPRING DEPLOYMENT MECHANISM 🌀');
    console.log('═'.repeat(40));
    
    // Visual spring representation
    const springChar = current === 0 ? '⚪' : '🔵';
    const tension = '═'.repeat(Math.max(0, current * 2));
    const coil = '🌀'.repeat(Math.max(0, this.maxCoils - current));
    
    console.log(`Spring: ${tension}${springChar}${coil}`);
    console.log(`Tension: ${'▓'.repeat(current)}${'░'.repeat(this.maxCoils - current)} ${current}/${this.maxCoils}`);
    console.log('═'.repeat(40));
    
    // Stage status
    this.stages.forEach((stage, i) => {
      let prefix;
      if (i < current) prefix = '✅';
      else if (i === current) {
        switch(status) {
          case 'running': prefix = '⏳'; break;
          case 'error': prefix = '❌'; break;
          case 'ready': prefix = '🔄'; break;
          default: prefix = '🔄';
        }
      } else prefix = '⚪';
      
      console.log(`${prefix} Stage ${i + 1}: ${stage.desc}`);
    });
    
    console.log('═'.repeat(40));
  }

  async executeStage(stageIndex) {
    const stage = this.stages[stageIndex];
    this.drawSpring(stageIndex, 'running');
    
    try {
      execSync(stage.cmd, { stdio: 'pipe' });
      await this.sleep(500); // Visual delay
      return true;
    } catch (error) {
      console.log(`\n💥 ERROR in ${stage.desc}:`);
      console.log(error.message);
      return false;
    }
  }

  async springForward() {
    while (this.currentCoil < this.maxCoils) {
      if (await this.executeStage(this.currentCoil)) {
        this.currentCoil++;
        this.saveState(this.currentCoil);
        this.drawSpring(this.currentCoil, 'success');
      } else {
        this.drawSpring(this.currentCoil, 'error');
        console.log(`\n🔙 SPRING RECOILED! Fix errors and try again.`);
        return false;
      }
    }
    
    console.log('\n🎉 SPRING FULLY EXTENDED - DEPLOYMENT COMPLETE! 🎉');
    this.reset();
    return true;
  }

  recoil(steps = 1) {
    this.currentCoil = Math.max(0, this.currentCoil - steps);
    this.saveState(this.currentCoil);
    this.drawSpring(this.currentCoil, 'idle');
    console.log(`🔙 Spring recoiled ${steps} step(s)`);
  }

  reset() {
    this.currentCoil = 0;
    try { fs.unlinkSync(this.stateFile); } catch {}
    this.drawSpring(0, 'idle');
    console.log('🔄 Spring reset to initial position');
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async interactive() {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const ask = (question) => new Promise(resolve => rl.question(question, resolve));

    while (true) {
      this.drawSpring(this.currentCoil, 'ready');
      console.log('\nCommands: [f]orward, [r]ecoil, [reset], [a]uto, [q]uit');
      
      const answer = await ask('> ');
      
      switch (answer.toLowerCase()) {
        case 'f':
        case 'forward':
          if (this.currentCoil < this.maxCoils) {
            if (await this.executeStage(this.currentCoil)) {
              this.currentCoil++;
              this.saveState(this.currentCoil);
            }
          }
          break;
        case 'r':
        case 'recoil':
          this.recoil(1);
          break;
        case 'reset':
          this.reset();
          break;
        case 'a':
        case 'auto':
          await this.springForward();
          break;
        case 'q':
        case 'quit':
          rl.close();
          return;
      }
    }
  }
}

// Run based on arguments
const spring = new SpringDeployment();

if (process.argv[2] === 'interactive') {
  spring.interactive();
} else {
  spring.springForward();
}